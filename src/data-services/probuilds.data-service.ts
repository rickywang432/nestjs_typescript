import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, Brackets, Repository } from 'typeorm';
import { GameEntity, GamePlayerEntity, PlayerEntity, PlayerFollowerEntity, TeamEntity } from '../data-entities';
import { QueryResult } from '../models/common';
import { GameTeamSide, GameUploadPlayerInfoModel, ProbuildModel, ProbuildPlayerModel, ProbuildQuery, ProbuildTeamModel } from '../models';
import { DbUtils } from './db-utils';

@Injectable()
export class ProbuildsDataService {
    constructor(
        @InjectRepository(PlayerFollowerEntity)
        private readonly playerFollowerRepository: Repository<PlayerFollowerEntity>,
        @InjectRepository(GamePlayerEntity)
        private readonly gamePlayerRepository: Repository<GamePlayerEntity>,
    ) { }

    private static _createProbuild(
        gamePlayer: GamePlayerEntity,
        playerList: GameUploadPlayerInfoModel[],
        opponentPlayerList: GameUploadPlayerInfoModel[],
        playerInfo: GameUploadPlayerInfoModel,
        opponentPlayerInfo: GameUploadPlayerInfoModel,
    ) {
        const probuild = new ProbuildModel();
        const allyTeam = new ProbuildTeamModel();
        const opponentTeam = new ProbuildTeamModel();
        probuild.gameId = gamePlayer.gameId;
        probuild.playerId = gamePlayer.playerId;
        probuild.startTime = gamePlayer.game.startTime;
        probuild.endTime = gamePlayer.game.endTime;
        probuild.championId = playerInfo.championId;
        probuild.opponentChampionId = opponentPlayerInfo.championId;
        probuild.role = playerInfo.role;
        probuild.summonerName = gamePlayer.player.name;
        probuild.proPictureURL = gamePlayer.player.pictureUrl;
        allyTeam.id = gamePlayer.teamId;
        allyTeam.side = gamePlayer.teamSide;
        allyTeam.logoURL = gamePlayer.team.logoUrl;
        allyTeam.players = playerList.map(player => ({
                            championId: player.championId,
                            summonerName: player.summonerIdentity.name,
                            role: player.role,
                        }));
        opponentTeam.id = gamePlayer.teamSide === GameTeamSide.Blue ? gamePlayer.game.redTeamId : gamePlayer.game.blueTeamId;
        opponentTeam.side = gamePlayer.teamSide === GameTeamSide.Blue ? GameTeamSide.Red : GameTeamSide.Blue;
        opponentTeam.players = opponentPlayerList.map(player => {
            const proPlayer = new ProbuildPlayerModel();
            proPlayer.championId = player.championId;
            proPlayer.summonerName = player.summonerIdentity.name;
            proPlayer.role = player.role;
            return proPlayer;
        });
        probuild.team = allyTeam;
        probuild.opponentTeam = opponentTeam;
        probuild.patch = gamePlayer.game.patchId;
        probuild.type = gamePlayer.game.type;

        if (playerInfo.championBuild) {
            probuild.startingItems = playerInfo.championBuild.startingItems;
            probuild.finalBuilds = playerInfo.championBuild.finalBuilds;
            probuild.buildPaths = playerInfo.championBuild.buildPaths;
            probuild.runePrimaryTree = playerInfo.championBuild.runePrimaryTree;
            probuild.runeSecondaryTree = playerInfo.championBuild.runeSecondaryTree;
            probuild.runeShards = playerInfo.championBuild.runeShards;
            probuild.skillOrder = playerInfo.championBuild.skillOrder;
            probuild.spells = playerInfo.championBuild.spells;
        }

        return probuild;
    }

    async find(userId: number, accessibleTeamId: number | undefined, query: ProbuildQuery): Promise<QueryResult<ProbuildModel>> {
        const dbFollowingPlayerList = await this.playerFollowerRepository.find({
            select: ['playerId'],
            where: {
                userId: userId,
            },
        });

        if (dbFollowingPlayerList.length == 0) {
            return new QueryResult<ProbuildModel>([], 0, query.pagination);
        }

        const dbFollowingPlayerIdList = dbFollowingPlayerList.map(x => x.playerId);

        const winsOnlyQuery = query.winsOnly ? `AND player.${GamePlayerEntity.metadata.teamSide} = game.${GameEntity.metadata.winnerTeamSide}` : '';

        const gamePlayerQueryBuilder = this.gamePlayerRepository.createQueryBuilder('player')
            .innerJoinAndMapOne(
                'player.game',
                GameEntity,
                'game',
                `player.gameId = game.id ${winsOnlyQuery}`,
            )
            .innerJoinAndMapOne(
                'player.player',
                PlayerEntity,
                'p',
                'player.playerId = p.id',
            )
            .innerJoinAndMapOne(
                'player.team',
                TeamEntity,
                'team',
                'player.teamId = team.id',
            )
            .orderBy('game.startTime', 'DESC');

        gamePlayerQueryBuilder.where({
            playerId: Any(dbFollowingPlayerIdList),
        });

        if (query.role != undefined) {
            gamePlayerQueryBuilder.andWhere('player.role = :role', {
                role: query.role,
            });
        }
        if (query.championIds != undefined) {
            gamePlayerQueryBuilder.andWhere('player.championId IN (:...championIds)', {
                championIds: query.championIds,
            });
        }
        if (query.teamSide === GameTeamSide.Blue || query.teamSide === GameTeamSide.Red) {
            gamePlayerQueryBuilder.andWhere('player.teamSide = :teamSide', {
                teamSide: query.teamSide,
            });
        }
        if (query.dateRange?.start != undefined) {
            gamePlayerQueryBuilder.andWhere('game.startTime >= :startTime', { startTime: query.dateRange.start });
        }
        if (query.dateRange?.end != undefined) {
            gamePlayerQueryBuilder.andWhere('game.startTime <= :endTime', { endTime: query.dateRange.end });
        }
        if (query.patchId != undefined) {
            gamePlayerQueryBuilder.andWhere('game.patchId = :patchId', { patchId: query.patchId.toLowerCase() });
        }
        // TODO: Filter region if necessary

        if (query.teamId) {
            gamePlayerQueryBuilder.andWhere(new Brackets(qb => {
                return qb.where(new Brackets(qbInner => {
                    return qbInner.where(`player.teamSide = ${GameTeamSide.Red}`)
                        .andWhere('game.blueTeamId = :teamId', { teamId: query.teamId });
                })).orWhere(new Brackets(qbInner => {
                    return qbInner.where(`player.teamSide = ${GameTeamSide.Blue}`)
                        .andWhere('game.redTeamId = :teamId', { teamId: query.teamId });
                }));
            }));
        }

        if (query.gameType) {
            gamePlayerQueryBuilder.andWhere('game.type = :gameType', {
                gameType: query.gameType,
            });
        }

        console.assert(accessibleTeamId);
        // TODO: enable this access check later
        // if (accessibleTeamId != undefined && accessibleTeamId > 0) {
        //     gamePlayerQueryBuilder.andWhere(new Brackets(qb => {
        //         return qb.where(new Brackets(qbInner => {
        //             return qbInner.where(`game.type = ${GameType.Scrim}`)
        //                 .andWhere(`player.teamId = ${accessibleTeamId}`);
        //         })).orWhere(new Brackets(qbInner => {
        //             return qbInner.where(`game.type != ${GameType.Scrim}`)
        //                 .andWhere(`player.teamId IS NOT NULL`);
        //         }));
        //     }));
        // } else {
        //     gamePlayerQueryBuilder.andWhere(`game.type != ${GameType.Scrim}`);
        // }

        DbUtils.addPagination(gamePlayerQueryBuilder, query);

        const [dbGamePlayers, totalCount] = await gamePlayerQueryBuilder.getManyAndCount();

        const probuilds: ProbuildModel[] = [];

        if (dbGamePlayers.length > 0) {
            for (const gamePlayer of dbGamePlayers) {
                const playerList = gamePlayer.teamSide == GameTeamSide.Red ? gamePlayer.game.redTeamInfo.players : gamePlayer.game.blueTeamInfo.players;
                const opposingPlayerList = gamePlayer.teamSide == GameTeamSide.Red ? gamePlayer.game.blueTeamInfo.players : gamePlayer.game.redTeamInfo.players;

                const playerInfo = playerList.find(x => gamePlayer.summonerId == x.summonerIdentity.id);
                const opponentPlayerInfo = opposingPlayerList.find(x => x.role == gamePlayer.role);

                // These fields must always have a value
                if (playerInfo && opponentPlayerInfo) {
                    probuilds.push(ProbuildsDataService._createProbuild(gamePlayer, playerList, opposingPlayerList, playerInfo, opponentPlayerInfo));
                }
            }
        }

        return new QueryResult<ProbuildModel>(probuilds, totalCount, query.pagination);
    }
}
