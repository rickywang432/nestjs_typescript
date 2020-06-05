import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Any, In, FindManyOptions } from 'typeorm';
import { GameEntity, GameFileEntity, GamePlayerEntity, PlayerEntity, TeamEntity, TeamMemberEntity, GameFileS3Info, UserSummonerEntity, GameSplitEntity, GamePatchEntity } from '../data-entities';
import { GameFileModel, GameFileType, GameLightModel, GameModel, GameStatsResponseModel, GamePlayerModel, GameQuery, GameTeamLightModel, GameTeamModel, GameTeamSide, PlayerProfileNestedModel, QueryResult, TeamProfileNestedModel, GamePlayerExtendedLightModel, GameFileUploadStatus, GameSplitModel, GamePatchModel, GameQuerySort, PlayerRole, GameUploadPlayerInfoModel, PlayerMatchStatsModel, PlayerAnyGeneralStatsModelBase, ChampionBuild } from '../models';
import { DbUtils, SortMap } from './db-utils';

/**
 * Provides access to game data.
 */
@Injectable()
export class GamesDataService {
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>,
        @InjectRepository(PlayerEntity)
        private readonly playerRepository: Repository<PlayerEntity>,
        @InjectRepository(GameEntity)
        private readonly gameRepository: Repository<GameEntity>,
        @InjectRepository(GamePlayerEntity)
        private readonly gamePlayerRepository: Repository<GamePlayerEntity>,
        @InjectRepository(TeamMemberEntity)
        private readonly teamMemberRepository: Repository<TeamMemberEntity>,
        @InjectRepository(GameFileEntity)
        private readonly gameFileRepository: Repository<GameFileEntity>,
        @InjectRepository(GameSplitEntity)
        private readonly gameSplitRepository: Repository<GameSplitEntity>,
        @InjectRepository(GamePatchEntity)
        private readonly gamePatchRepository: Repository<GamePatchEntity>,
        @InjectRepository(UserSummonerEntity)
        private readonly userSummonerRepository: Repository<UserSummonerEntity>,
    ) { }

    /**
     * Searches for games.
     * @param query Query.
     */
    async find(query: GameQuery): Promise<QueryResult<GameLightModel>> {
        let dbQuery = this.gameRepository.createQueryBuilder()
            .where('1 = 1');

        if (query.dateRange?.start != undefined) {
            dbQuery = dbQuery.andWhere(`${GameEntity.metadata.startTime} >= :startTime`, { startTime: query.dateRange.start });
        }
        if (query.dateRange?.end != undefined) {
            dbQuery = dbQuery.andWhere(`${GameEntity.metadata.endTime} <= :endTime`, { endTime: query.dateRange.end });
        }
        if (query.gameType != undefined) {
            dbQuery = dbQuery.andWhere(`${GameEntity.metadata.type} = :type`, { type: query.gameType });
        }
        if (query.regionId != undefined) {
            dbQuery = dbQuery.andWhere(`${GameEntity.metadata.regionId} = :regionId`, { regionId: query.regionId.toLowerCase() });
        }
        if (query.patchId != undefined) {
            dbQuery = dbQuery.andWhere(`${GameEntity.metadata.patchId} = :patchId`, { patchId: query.patchId.toLowerCase() });
        }
        if (query.teams != undefined && query.teams.length > 0) {
            for (let k = 0; k < query.teams.length; k++) {
                const item = query.teams[k];

                if (item.side == GameTeamSide.Red) {
                    if (item.isWinner == true) {
                        dbQuery = dbQuery.andWhere(`(${GameEntity.metadata.redTeamId} = :redTeamId${k} and ${GameEntity.metadata.winnerTeamSide} = ${GameTeamSide.Red})`, { [`redTeamId${k}`]: item.id });
                    } else {
                        dbQuery = dbQuery.andWhere(`${GameEntity.metadata.redTeamId} = :redTeamId${k}`, { [`redTeamId${k}`]: item.id });
                    }
                } else if (item.side == GameTeamSide.Blue) {
                    if (item.isWinner == true) {
                        dbQuery = dbQuery.andWhere(`(${GameEntity.metadata.blueTeamId} = :blueTeamId${k} and ${GameEntity.metadata.winnerTeamSide} = ${GameTeamSide.Blue})`, { [`blueTeamId${k}`]: item.id });
                    } else {
                        dbQuery = dbQuery.andWhere(`${GameEntity.metadata.blueTeamId} = :blueTeamId${k}`, { [`blueTeamId${k}`]: item.id });
                    }
                } else {
                    if (item.isWinner == true) {
                        dbQuery = dbQuery.andWhere(
                            `((${GameEntity.metadata.redTeamId} = :redTeamId${k} and ${GameEntity.metadata.winnerTeamSide} = ${GameTeamSide.Red}) or (${GameEntity.metadata.blueTeamId} = :blueTeamId${k} and ${GameEntity.metadata.winnerTeamSide} = ${GameTeamSide.Blue}))`,
                            { [`redTeamId${k}`]: item.id, [`blueTeamId${k}`]: item.id }
                        );
                    } else {
                        dbQuery = dbQuery.andWhere(
                            `(${GameEntity.metadata.redTeamId} = :redTeamId${k} or ${GameEntity.metadata.blueTeamId} = :blueTeamId${k})`,
                            { [`redTeamId${k}`]: item.id, [`blueTeamId${k}`]: item.id }
                        );
                    }
                }
            }
        }

        DbUtils.addPagination(dbQuery, query);
        DbUtils.addSorting(dbQuery, GamesDataService.sortMap, [query.sort], GamesDataService.defaultSort);


        let [gameList, totalCount] = await dbQuery.getManyAndCount();

        let gamePlayerList = await this.gamePlayerRepository.find({
            where: {
                gameId: Any(gameList.map(x => x.id)),
            },
        });

        if (query.players) {
            const vs = query.players.length>1? true: false;
            gameList = gameList.filter((game: GameEntity) => {
                let item = query.players![0];
                let result = gamePlayerList.find((gamePlayer: GamePlayerEntity) => {
                    return (
                        gamePlayer.gameId == game.id && gamePlayer.playerId == item.id
                    );
                });

                if (!result) return false;

                if (vs === true ) {
                    item = query.players![1];
                    result = gamePlayerList.find((gamePlayer: GamePlayerEntity) => {
                        return (
                            gamePlayer.gameId == game.id && gamePlayer.playerId == item.id
                        );
                    });
                    if (!result) return false;
                }
                return true;
            });
            totalCount = gameList.length;
        }


        // Teams
        const teamList = await this.teamRepository.findByIds(gameList.map(x => x.redTeamId).concat(gameList.map(x => x.blueTeamId)).filter(x => x != undefined));
        
        // Game players load again

        if (query && query.players && query.players.length > 0) {

            gamePlayerList = await this.gamePlayerRepository.find({
                where: {
                    gameId: Any(gameList.map(x => x.id)),
                },
            });
        }

        // Players
        const playerList = await this.playerRepository.findByIds(gamePlayerList.map(x => x.playerId));

        const teamMemberList = await this.teamMemberRepository.find({
            where: {
                playerId: Any(playerList.map(x => x.id)),
            },
        });

        function getTeamProfile(id: number): TeamProfileNestedModel {
            const item = teamList.find(item => item.id == id)!;

            return new TeamProfileNestedModel({
                id: item.id,
                name: item.name,
                type: item.type,
                regionId: item.regionId,
                logoUrl: item.logoUrl,
            });
        }

        function getPlayerProfile(id: number): PlayerProfileNestedModel {
            const item = playerList.find(item => item.id == id)!;
            let pictureUrl = item.pictureUrl;
            
            if(!pictureUrl) {
                const teamMember = teamMemberList.find(x => x.playerId == item.id);
                if(teamMember) {
                    pictureUrl = teamMember.pictureUrl;
                }
            }

            return new PlayerProfileNestedModel({
                id: item.id,
                name: item.name,
                pictureUrl,
            });
        }

        function getMatchedStats(role: number, player: GameUploadPlayerInfoModel): PlayerAnyGeneralStatsModelBase {
            switch(role) {
                case PlayerRole.Bottom:
                    return player.stats.bottom?.general!;
                case PlayerRole.Top:
                    return player.stats.top?.general!;
                case PlayerRole.Middle:
                    return player.stats.middle?.general!;
                case PlayerRole.Jungler:
                    return player.stats.jungler?.general!;
                default:
                    return player.stats.support?.general!;
            }
        }


        function getGeneralStats(teamSide: GameTeamSide, summonerId: number, role: number, game: GameEntity): PlayerMatchStatsModel {
            const teamInfo = teamSide == GameTeamSide.Red? game.redTeamInfo: game.blueTeamInfo;
            const playerBySummoner = teamInfo.players.find(x => x.summonerIdentity.id == summonerId )!;

            const generalStats = getMatchedStats(role, playerBySummoner);

            return new PlayerMatchStatsModel({
                avgKillCount: generalStats.avgKillCount,
                avgDeathCount: generalStats.avgDeathCount,
                avgAssistCount: generalStats.avgAssistCount,
                avgGoldCount: generalStats.avgGoldCount,
            });         
        }

        function getChampionBuild(teamSide: GameTeamSide, summonerId: number, game: GameEntity): ChampionBuild | undefined {
            const teamInfo = teamSide == GameTeamSide.Red? game.redTeamInfo: game.blueTeamInfo;
            const playerBySummoner = teamInfo.players.find(x => x.summonerIdentity.id == summonerId)!;
            return playerBySummoner.championBuild;
        }

        function getGamePlayers(gameId: number, teamSide: GameTeamSide, game: GameEntity): GamePlayerExtendedLightModel[] {

            return gamePlayerList
                .filter(x => x.gameId == gameId && x.teamSide == teamSide)
                .map(x => new GamePlayerExtendedLightModel({
                    profile: getPlayerProfile(x.playerId),
                    championId: x.championId,
                    role: x.role,
                    general: getGeneralStats(teamSide, x.summonerId, x.role,  game),
                    championBuild: getChampionBuild(teamSide, x.summonerId, game),
                }));
        }

        const itemList = gameList.map(x => new GameLightModel({
            id: x.id,
            uid: x.uid,
            gameStart: x.startTime,
            gameEnd: x.endTime,
            gameType: x.type,
            regionId: x.regionId,
            patchId: x.patchId,
            redTeam: new GameTeamLightModel({
                profile: x.redTeamId == undefined ? undefined : getTeamProfile(x.redTeamId),
                players: getGamePlayers(x.id, GameTeamSide.Red, x),
            }),
            blueTeam: new GameTeamLightModel({
                profile: x.blueTeamId == undefined ? undefined : getTeamProfile(x.blueTeamId),
                players: getGamePlayers(x.id, GameTeamSide.Blue, x),
            }),
            winnerTeamSide: x.winnerTeamSide,
        }));

        return new QueryResult(itemList, totalCount, query.pagination);
    }

    /**
     * Returns information about a game.
     * @param id The ID of the game.
     */
    async get(id: number): Promise<GameModel | undefined> {
        const x = await this.gameRepository.findOne(id);

        if (x == undefined) {
            return undefined;
        }

        // Teams
        const teamList = await this.teamRepository.findByIds([x.redTeamId, x.blueTeamId]);
        // Game players
        const gamePlayerList = await this.gamePlayerRepository.find({
            where: {
                gameId: x.id,
            },
        });
        // Players
        const playerList = await this.playerRepository.findByIds(gamePlayerList.map(x => x.playerId));
        // Files
        const gameFileList = await this.gameFileRepository.find({
            where: {
                gameUid: x.uid,
            },
        });
        // User IDs
        const userSummonerList = await this.userSummonerRepository.find({
            where: {
                summonerId: In(gamePlayerList.map(x => x.summonerId)),
            },
        });

        function getTeamProfile(id: number): TeamProfileNestedModel {
            const item = teamList.find(item => item.id == id)!;

            return new TeamProfileNestedModel({
                id: item.id,
                name: item.name,
                type: item.type,
                regionId: item.regionId,
                logoUrl: item.logoUrl,
            });
        }

        function getPlayerProfile(id: number): PlayerProfileNestedModel {
            const item = playerList.find(item => item.id == id)!;

            return new PlayerProfileNestedModel({
                id: item.id,
                name: item.name,
                pictureUrl: item.pictureUrl,
            });
        }

        function getPlayerFile(summonerId: number, type: GameFileType): GameFileModel | undefined {
            const userIdList = userSummonerList.filter(x => x.summonerId == summonerId);
            const item = gameFileList.find(x => x.type == type && userIdList.some(y => y.userId == x.userId));

            if (item == undefined) {
                return undefined;
            }

            return new GameFileModel({
                id: item.id,
                type: item.type,
                format: item.format,
                compressionMethod: item.compressionMethod,
                metadata: item.metadata,
                uploadStatus: item.uploadStatus,
            });
            return undefined;
        }

        function getFile(type: GameFileType): GameFileModel | undefined {
            const item = gameFileList.find(item => item.type == type);

            if (item == undefined) {
                return undefined;
            } else {
                return new GameFileModel({
                    id: item.id,
                    type: item.type,
                    format: item.format,
                    compressionMethod: item.compressionMethod,
                    metadata: item.metadata,
                    uploadStatus: item.uploadStatus,
                });
            }
        }

        const redTeamModel = new GameTeamModel();
        if (x.redTeamId != undefined) {
            redTeamModel.profile = getTeamProfile(x.redTeamId);
        }

        const blueTeamModel = new GameTeamModel();
        if (x.blueTeamId != undefined) {
            blueTeamModel.profile = getTeamProfile(x.blueTeamId);
        }

        redTeamModel.players = gamePlayerList
            .filter(x => x.teamSide == GameTeamSide.Red)
            .map(x => new GamePlayerModel({
                profile: getPlayerProfile(x.playerId),
                championId: x.championId,
                role: x.role,
                videoFile: getPlayerFile(x.summonerId, GameFileType.Video),
                audioFile: getPlayerFile(x.summonerId, GameFileType.Audio),
            }));

        blueTeamModel.players = gamePlayerList
            .filter(x => x.teamSide == GameTeamSide.Blue)
            .map(x => new GamePlayerModel({
                profile: getPlayerProfile(x.playerId),
                championId: x.championId,
                role: x.role,
                videoFile: getPlayerFile(x.summonerId, GameFileType.Video),
                audioFile: getPlayerFile(x.summonerId, GameFileType.Audio),
            }));

        return new GameModel({
            id: x.id,
            uid: x.uid,
            gameStart: x.startTime,
            gameEnd: x.endTime,
            gameType: x.type,
            regionId: x.regionId,
            patchId: x.patchId,
            redTeam: redTeamModel,
            blueTeam: blueTeamModel,
            winnerTeamSide: x.winnerTeamSide,
            replayFile: getFile(GameFileType.Replay),
            statsFile: getFile(GameFileType.Statistics),
        });
    }

    /**
     * Returns stats information about a game.
     * @param id The ID of the game.
     */
    async getStats(id: number): Promise<GameStatsResponseModel | undefined> {
        const x = await this.gameRepository.findOne(id);

        if (x == undefined) {
            return undefined;
        }
        return new GameStatsResponseModel({
            redTeam: x.redTeamInfo,
            blueTeam: x.blueTeamInfo,
            winnerTeamSide: x.winnerTeamSide,
        });
    }


    /**
     * Returns the S3-related info of a game-related file.
     * @param userId The ID of the authenticated user.
     * @param gameId the ID of the game.
     * @param fileId The ID of the file.
     * @returns The S3-related info or `undefined` if the file does no exist.
     */
    async getFileS3Info(userId: number, gameId: number, fileId: number): Promise<{ uploadStatus: GameFileUploadStatus, s3Info: GameFileS3Info } | undefined> {

        // TODO: Check if the user can access the file
        console.assert(userId != undefined);
        console.assert(gameId != undefined);

        const dbResult = await this.gameFileRepository.findOne(
            {
                where: {
                    id: fileId,
                },
                select: ['s3Info', 'uploadStatus'],
            }
        );

        return dbResult == undefined ? undefined : { uploadStatus: dbResult.uploadStatus, s3Info: dbResult.s3Info };
    }

    /* #region Common */

    /**
     * Returns information about all splits.
     * @param includeInactive Indicates if inactive splits should be returned.
     */
    async getSplits(includeInactive = false): Promise<GameSplitModel[]> {
        let findOptions: FindManyOptions<GameSplitEntity> | undefined;
        if (includeInactive) {
            findOptions = undefined;
        } else {
            findOptions = { where: { isActive: true } };
        }

        return (await this.gameSplitRepository.find(findOptions)).map(x => new GameSplitModel({
            name: x.name,
            regionId: x.regionId,
            startTime: x.startTime,
            endTime: x.endTime,
            isActive: x.isActive,
        }));
    }

    /**
     * Returns information about all patches for which games have been recorded.
     * @param includeInactive Indicates if inactive patches should be returned.
     */
    async getPatches(includeInactive = false): Promise<GamePatchModel[]> {
        let findOptions: FindManyOptions<GamePatchEntity> | undefined;
        if (includeInactive) {
            findOptions = undefined;
        } else {
            findOptions = { where: { isActive: true } };
        }

        return (await this.gamePatchRepository.find(findOptions)).map(x => new GamePatchModel({
            name: x.name,
            isActive: x.isActive,
        }));
    }

    /* #endregion */

    static defaultSort = GameQuerySort.StartTimeDesc;

    static sortMap: SortMap = new Map<number, { sort: string, order?: 'ASC' | 'DESC' }>([
        [GameQuerySort.StartTimeAsc, { sort: GameEntity.metadata.startTime, order: 'ASC' }],
        [GameQuerySort.StartTimeDesc, { sort: GameEntity.metadata.startTime, order: 'DESC' }],
    ]);
}
