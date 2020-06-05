import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { GraphQLClient } from 'graphql-request';
import { Strategy } from 'passport-http-bearer';
import config from '../app.config';
import { memoryCache } from '../tools';
import { GqlMeModel, GqlResponseData } from './auth-server-gql';
import { AuthenticatedUser } from './authenticated-user';
import { UsersDataService, TeamsDataService } from '../data-services';

@Injectable()
export class HttpBearerAuthStrategy extends PassportStrategy(Strategy, 'bearer') {
    constructor(
        private readonly userDataService: UsersDataService,
        private readonly teamsDataService: TeamsDataService
    ) { super(); }

    async validate(token: string): Promise<AuthenticatedUser> {
        const cacheKey = 'Auth:Token:' + token;

        let result: AuthenticatedUser | undefined = memoryCache.get(cacheKey);

        if (result) {
            return result;
        }

        const client = new GraphQLClient(
            config.authServer.url,
            {
                headers: {
                    authorization: 'Bearer ' + token,
                },
            });

        let data: GqlResponseData<GqlMeModel, 'me'>;

        try {
            data = await client.request(`
                {
                    me {
                        id
                        name
                        summoners {
                            summonerId
                            region
                        }
                    }
                }`);
        } catch {
            throw new UnauthorizedException();
        }

        const userAuthId = parseInt(data.me.id);
        const summonerList: { id: number, region: string }[] = [];

        if (data.me.summoners != undefined) {
            for (const item of data.me.summoners) {
                if (item.summonerId != undefined && item.region != undefined && new RegExp('^\\d{1,18}$', 'gi').test(item.summonerId)) {
                    summonerList.push({ id: parseInt(item.summonerId), region: item.region });
                }
            }
        }

        const userId = await this.userDataService.getOrCreateUser(userAuthId, data.me.name, summonerList);

        const teamMember = await this.teamsDataService.getTeamMemberProfileByName(data.me.name, true);

        result = {
            id: userId,
            authId: userAuthId,
            teamMember: teamMember == undefined? undefined : {
                teamId: teamMember.team.id,
                teamMemberId: teamMember.id,
            },
        };

        // Cache the user for 30m
        memoryCache.set(cacheKey, result, 60 * 60);

        return result;
    }
}
