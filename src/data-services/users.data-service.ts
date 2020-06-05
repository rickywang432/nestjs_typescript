import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { UserEntity, UserSummonerEntity } from '../data-entities';

/**
 * Provides access to user data.
 */
@Injectable()
export class UsersDataService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(UserSummonerEntity)
        private readonly userSummonerRepository: Repository<UserSummonerEntity>,
    ) { }

    /**
     * Returns the ID of a user. Creates a new user if one does not already exist.
     * @param authId The ID provided by the auth server.
     * @param authName The name provided by the auth server.
     * @param summoners The summoners linked to the user.
     * @returns The ID of the user.
     */
    async getOrCreateUser(authId: number, authName: string, summoners?: { id: number, region: string }[]): Promise<number> {
        const data = await this.userRepository.findOne({ where: { authId: authId }, select: ['id'] });

        let userId: number;

        if (data) {
            // CAUTION: Update the name in case it has changed - CAUTION this DOES happen
            await this.userRepository.update(
                {
                    authId: authId,
                    authName: Not(authName),
                },
                {
                    authName: authName,
                });

            userId = data.id;
        } else {
            const record = this.userRepository.create({
                authId: authId,
                authName: authName,
            });

            await this.userRepository.insert(record);

            userId = record.id;
        }

        // Update the list of summoners
        if (summoners != undefined && summoners.length > 0) {
            for (const item of summoners) {
                if (await this.userSummonerRepository.count({ where: { userId: userId, summonerId: item.id } }) == 0)
                    this.userSummonerRepository.insert({
                        userId: userId,
                        summonerId: item.id,
                        regionId: item.region,
                    });
            }
        }

        return userId;
    }
}