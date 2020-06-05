import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Repository } from 'typeorm';
import { PlayerEntity, PlayerFollowerEntity, TeamEntity, TeamMemberEntity } from '../data-entities';
import { PlayerProfileLightModel, TeamMemberProfileModel, TeamProfileNestedModel } from '../models';

/**
 * Provides access to functions to follow and unfollow team members.
 */
@Injectable()
export class AuthUserFollowDataService {
    constructor(
        @InjectRepository(PlayerFollowerEntity)
        private readonly playerFollowerRepository: Repository<PlayerFollowerEntity>,
        @InjectRepository(PlayerEntity)
        private readonly playerRepository: Repository<PlayerEntity>,
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>,
        @InjectRepository(TeamMemberEntity)
        private readonly teamMemberRepository: Repository<TeamMemberEntity>,
    ) {}

    /**
     * Starts following a player.
     * @param userId The ID of the user.
     * @param id The ID of the player.
     */
    async followPlayer(userId: number, playerId: number): Promise<void> {
        if (await this.playerFollowerRepository.count({ where: { userId: userId, playerId: playerId } }) == 0) {
            await this.playerFollowerRepository.insert({
                userId: userId,
                playerId: playerId,
            });
        }
    }

    /**
     * Stops following a player.
     * @param userId The ID of the user.
     * @param id The ID of the player.
     */
    async unfollowPlayer(userId: number, playerId: number): Promise<void> {
        await this.playerFollowerRepository.delete({
            userId: userId,
            playerId: playerId,
        });
    }

    /**
     * Returns a value indicating if a player is being followed.
     * @param userId The ID of the user.
     * @param id The ID of the player.
     */
    async isPlayerFollowed(userId: number, playerId: number): Promise<boolean> {
        return await this.playerFollowerRepository.count({
            userId: userId,
            playerId: playerId,
        }) > 0;
    }

    /**
     * Returns the list of followed players.
     * @param userId The ID of the user.
     */
    async getPlayers(userId: number): Promise<PlayerProfileLightModel[]> {
        const dbPlayerList = await this.playerRepository.createQueryBuilder('root')
            .innerJoin(PlayerFollowerEntity, 'follower', 'root.id = follower.player_id and follower.user_id = :userId', { userId: userId })
            .getMany();

        if (dbPlayerList.length == 0) {
            return [];
        }

        const dbTeamMemberList = await this.teamMemberRepository
            .find({
                where: {
                    playerId: Any(dbPlayerList.map(x => x.id)),
                    isActive: true,
                },
            });

        const dbTeamList = dbTeamMemberList.length == 0 ? [] : await this.teamRepository
            .find({
                where: {
                    id: Any(dbTeamMemberList.map(x => x.teamId)),
                    isActive: true,
                },
            });

        function getTeamMember(playerId: number): TeamMemberProfileModel | undefined {
            const dbTeamMember = dbTeamMemberList.find(x => x.playerId == playerId);
            if (dbTeamMember == undefined) {
                return undefined;
            }
            const dbTeam = dbTeamList.find(x => x.id == dbTeamMember.teamId);
            if (dbTeam == undefined) {
                // Can happen if the team member is active but the team is not active
                return undefined;
            }

            return new TeamMemberProfileModel({
                id: dbTeamMember.id,
                name: dbTeamMember.name,
                pictureUrl: dbTeamMember.pictureUrl,
                role: dbTeamMember.role,
                isActive: dbTeamMember.isActive,
                team: new TeamProfileNestedModel({
                    id: dbTeam.id,
                    name: dbTeam.name,
                    type: dbTeam.type,
                    regionId: dbTeam.regionId,
                    logoUrl: dbTeam.logoUrl,
                }),
            });
        }

        return dbPlayerList.map(x => new PlayerProfileLightModel({
            id: x.id,
            name: x.name,
            summonerName: x.summonerName,
            pictureUrl: x.pictureUrl,
            teamMember: getTeamMember(x.id),
        }));
    }
}