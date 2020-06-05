import { Injectable } from '@nestjs/common';
import {
  PlayerChampionStatsModel,
  PlayerProfileLightModel,
  PlayerProfileModel,
  PlayerQuery,
  PlayerStatsModel,
  PlayerStatsQuery,
  PlayerRole,
  GameUploadPlayerInfoModel,
  QueryResult,
  GameTeamSide,
  PlayerAnyGeneralStatsModelBase,
  PlayerAnyGamePeriodStatsModel,
  TeamMemberProfileModel,
  TeamProfileNestedModel,
  PlayerWardQuery,
  WardResponse,
  WardQueryType,
  GameWardAggregationModel,
  GameWardEventInfoModel,
  PlayerComparableStatsModel,
} from '../models';

import {
  PlayerEntity,
  TeamEntity,
  GamePlayerEntity,
  GameEntity,
  TeamMemberEntity,
} from '../data-entities';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Brackets, In, Any } from 'typeorm';

import { ILike } from '../tools/typeorm-ext';

import { DbUtils } from './db-utils';
import { PlayerStatsUtils } from './players-stats-utils';

/**
 * Provides access to game stats data.
 */

class GameStatsModel {
  role: PlayerRole[];
  myTeam: PlayerStatsModel[];
  enemyTeam: PlayerStatsModel[];
}

/**
 * Provides access to player data.
 */
@Injectable()
export class PlayersDataService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>,
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
    @InjectRepository(GamePlayerEntity)
    private readonly gamePlayerEntityRepository: Repository<GamePlayerEntity>,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  /**
   * Searches for players.
   * @param query Query.
   */
  async find(
    query: PlayerQuery,
  ): Promise<QueryResult<PlayerProfileLightModel>> {
    const dbQuery: FindManyOptions<PlayerEntity> = {};

    if (query.text != undefined) {
      dbQuery.where = { name: ILike(`%${query.text}%`) };
    }

    DbUtils.addPagination(dbQuery, query);

    const [dbItemList, totalCount] = await this.playerRepository.findAndCount(
      dbQuery,
    );

    const promises: Promise<PlayerProfileLightModel>[] = dbItemList.map(async x => {
      const player = new PlayerProfileLightModel({
        id: x.id,
        name: x.name,
        summonerName: x.summonerName,
        pictureUrl: x.pictureUrl,
      });

      if (query.includeTeamInfo) {
        const dbTeamMember = await this.teamMemberRepository.findOne({
          where: { playerId: x.id, isActive: true },
        });
        const dbTeam =
          dbTeamMember == undefined
            ? undefined
            : await this.teamRepository.findOne({
                where: { id: dbTeamMember?.teamId, isActive: true },
              });

        player.teamMember =
          dbTeamMember == undefined || dbTeam == undefined
            ? undefined
            : new TeamMemberProfileModel({
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
      return player;
    });

    const itemList = await Promise.all(promises);

    return new QueryResult<PlayerProfileLightModel>(
      itemList,
      totalCount,
      query.pagination,
    );
  }

  /**
   * Returns information about a player.
   * @param id The ID of the player.
   */
  async getProfile(id: number): Promise<PlayerProfileModel | undefined> {
    const dbPlayer = await this.playerRepository.findOne(id);

    if (dbPlayer == undefined) {
      return undefined;
    }

    const dbTeamMember = await this.teamMemberRepository.findOne({
      where: { playerId: id, isActive: true },
    });
    const dbTeam =
      dbTeamMember == undefined
        ? undefined
        : await this.teamRepository.findOne({
            where: { id: dbTeamMember?.teamId, isActive: true },
          });

    return new PlayerProfileModel({
      id: dbPlayer.id,
      name: dbPlayer.name,
      summonerName: dbPlayer.summonerName,
      pictureUrl: dbPlayer.pictureUrl,
      // The team can be `undefined` if the team member is active but the team is not active
      teamMember:
        dbTeamMember == undefined || dbTeam == undefined
          ? undefined
          : new TeamMemberProfileModel({
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
            }),
    });
  }

  /**
   * Returns a query of player.
   * @param playerId The ID of the player.
   * @param query The base query for player stats.
   */
  private async getBasicQueryBuilder(
    playerId: number,
    query: PlayerStatsQuery
  ) {
    let gameIdWhere;
    if (query.championId) {
      gameIdWhere = {
        playerId: playerId,
        championId: query.championId,
      };
    } else {
      gameIdWhere = { playerId };
    }
    let gameIds = await this.gamePlayerEntityRepository.find({
      select: ['gameId'],
      where: gameIdWhere,
    });

    // player team
    const playerTeamIDs = await this.gamePlayerEntityRepository.find({
      select: ['teamId'],
      where: { playerId },
    });
    const playerTeamID = playerTeamIDs.map(x => x.teamId).pop();

    // gameVersusPlayerdb
    let versusTeamIds: GamePlayerEntity[] = [];
    if (query.versusPlayerId != undefined) {
      versusTeamIds = await this.gamePlayerEntityRepository.find({
        select: ['teamId'],
        where: {
          playerId: query.versusPlayerId,
        },
      });
    }

    // Versus Player User IDs
    const versusTeamId = versusTeamIds.map(x => x.teamId).pop();

    let originalDbQuery = this.gameRepository
      .createQueryBuilder()
      .where('1 = 1');

    if (query.dateRange?.start != undefined) {
      originalDbQuery = originalDbQuery.andWhere(
        `${GameEntity.metadata.startTime} >= :startTime`,
        { startTime: query.dateRange?.start },
      );
    }
    if (query.dateRange?.end != undefined) {
      originalDbQuery = originalDbQuery.andWhere(
        `${GameEntity.metadata.endTime} <= :endTime`,
        { endTime: query.dateRange?.end },
      );
    }
    if (query.gameType != undefined) {
      originalDbQuery = originalDbQuery.andWhere(
        `${GameEntity.metadata.type} = :type`,
        { type: query.gameType },
      );
    }
    if (query.patchId != undefined) {
      originalDbQuery = originalDbQuery.andWhere(
        `${GameEntity.metadata.patchId} = :patchId`,
        { patchId: query.patchId!.toLowerCase() },
      );
    }

    if (!query.versusPlayerId && query.teamSide) {
      if (query.teamSide == GameTeamSide.Red) {
        originalDbQuery = originalDbQuery.andWhere(
          `${GameEntity.metadata.redTeamId} = :redTeamId`,
          { redTeamId: playerTeamID },
        );
      } else if (query.teamSide == GameTeamSide.Blue) {
        originalDbQuery = originalDbQuery.andWhere(
          `${GameEntity.metadata.blueTeamId} = :blueTeamId`,
          { blueTeamId: playerTeamID },
        );
      }
    }

    if (query.versusPlayerId) {
      if (query.teamSide) {
        if (query.teamSide == GameTeamSide.Red) {
          originalDbQuery = originalDbQuery.andWhere(
            `${GameEntity.metadata.redTeamId} = :redTeamId and ${GameEntity.metadata.blueTeamId} = :blueTeamId`,
            { redTeamId: playerTeamID, blueTeamId: versusTeamId },
          );
        } else if (query.teamSide == GameTeamSide.Blue) {
          originalDbQuery = originalDbQuery.andWhere(
            `${GameEntity.metadata.redTeamId} = :redTeamId and ${GameEntity.metadata.blueTeamId} = :blueTeamId`,
            { redTeamId: versusTeamId, blueTeamId: playerTeamID },
          );
        }
      } else {
        originalDbQuery = originalDbQuery.andWhere(
          new Brackets(qb => {
            qb.where(
              `${GameEntity.metadata.redTeamId} = :redTeamId and ${GameEntity.metadata.blueTeamId} = :blueTeamId`,
              { redTeamId: playerTeamID, blueTeamId: versusTeamId },
            ).orWhere(
              `${GameEntity.metadata.redTeamId} = :redTeamId and ${GameEntity.metadata.blueTeamId} = :blueTeamId`,
              { redTeamId: versusTeamId, blueTeamId: playerTeamID },
            );
          }),
        );
      }
    }

    let comparePlayerGames: GamePlayerEntity[];

    if (query.compareToPlayerId != undefined) {
      let compareWhere: object = {
        playerId: query.compareToPlayerId,
      };
      if (query.championId)
        compareWhere = {
          playerId: query.compareToPlayerId,
          championId: query.championId,
        };

      comparePlayerGames = await this.gamePlayerEntityRepository.find({
        select: ['gameId'],
        where: compareWhere,
      });

      gameIds = gameIds.filter(x => {
        const index = comparePlayerGames.findIndex(y => y.gameId == x.gameId);
        if (index >= 0) return true;
        return false;
      });
    } else if (query.compareToAllCompetitivePlayersInRegionId != undefined) {
      const teamsInRegion = await this.teamRepository.find({
        where: { regionId: query.compareToAllCompetitivePlayersInRegionId },
      });
      comparePlayerGames = await this.gamePlayerEntityRepository.find({
        select: ['gameId'],
        where: {
          teamId: In(teamsInRegion.map(x => x.id)),
        },
      });
    }

    if (gameIds && gameIds.length > 0) {
      originalDbQuery = originalDbQuery.andWhereInIds(
        gameIds.map(x => x.gameId),
      );
    } else {
      originalDbQuery = originalDbQuery.andWhereInIds([-1]); //To avoid error
    }

    originalDbQuery = originalDbQuery.orderBy(GameEntity.metadata.startTime, 'DESC');
    originalDbQuery = originalDbQuery.limit(
      query.compareToLastNMatchCount ? query.compareToLastNMatchCount : 15,
    );

    return originalDbQuery;
  }

  /**
   * Returns statistics about a player.
   * @param id The ID of the player.
   * @param query Query.
   */
  async findStats(
    id: number,
    query: PlayerStatsQuery,
  ): Promise<PlayerComparableStatsModel> {
    let originalDbQuery = await this.getBasicQueryBuilder(id, query);
    const primaryGamesCollection = await originalDbQuery.getMany();

    // playerRole
    const playerRoles = await this.gamePlayerEntityRepository.find({
      select: ['role'],
      where: { playerId: id },
    });

    // playerteam
    const playerTeamIDs = await this.gamePlayerEntityRepository.find({
      select: ['teamId'],
      where: { playerId: id },
    });
    const playerRole = playerRoles.map(x => x.role).pop()!;
    const playerTeamID = playerTeamIDs.map(x => x.teamId).pop();
    

    const gameStatsList: GameStatsModel[] = [];
    const opponentGameStatsList: GameStatsModel[] = [];

    primaryGamesCollection.map(primaryGames => {
      let myTeam = undefined;
      let enemyTeam = undefined;
      const role = primaryGames.redTeamInfo.players.map(x => x.role);

      if (playerTeamID == primaryGames.redTeamId) {
        myTeam = primaryGames.redTeamInfo.players.map(x => x.stats);
        enemyTeam = primaryGames.blueTeamInfo.players.map(x => x.stats);
      } else if (playerTeamID == primaryGames.blueTeamId) {
        enemyTeam = primaryGames.redTeamInfo.players.map(x => x.stats);
        myTeam = primaryGames.blueTeamInfo.players.map(x => x.stats);
      }
      const gameStatsModelItem = new GameStatsModel();
      gameStatsModelItem.role = role;
      gameStatsModelItem.myTeam = myTeam!;
      gameStatsModelItem.enemyTeam = enemyTeam!;
      gameStatsList.push(gameStatsModelItem);

      const opponentGameStatsModelItem = new GameStatsModel();
      opponentGameStatsModelItem.role = role;
      opponentGameStatsModelItem.myTeam = enemyTeam!;
      opponentGameStatsModelItem.enemyTeam = myTeam!;
      opponentGameStatsList.push(opponentGameStatsModelItem);
    });

    const result = new PlayerComparableStatsModel();
    result.primaryPlayerStats = await PlayerStatsUtils.getPlayerStats(
      playerRole,
      gameStatsList,
    );

    if (query.compareToPlayerId || query.versusPlayerId) {
      result.secondaryPlayerStats = await PlayerStatsUtils.getPlayerStats(
        playerRole,
        opponentGameStatsList,
      );
    }

    return result;
  }

  /**
   * Returns statistics about wards of a player.
   * @param id The ID of the player.
   * @param query Query.
   */
  async getWardsInfo(id: number, query: PlayerWardQuery): Promise<WardResponse> {
    // Error Checking
    if (query == undefined) {
      throw new Error('undefined query');
    }

    // Get summoner name from player id
    const dbPlayer = await this.playerRepository.findOne(id);
    if (!dbPlayer) {
      throw new Error('undefined player');
    }

    var summonerName = dbPlayer.summonerName;
    const names = dbPlayer.summonerName.split(' ');
    if (names.length > 1) {
      summonerName = names[1];
    }
    
    // Fetch DB
    const dbQuery = await this.getBasicQueryBuilder(id, query);
    let gameList = await dbQuery.getMany();

    // Return Wards
    const result = new WardResponse();
    result.maxGameLength = 0;
    result.mostCommonWards = [];
    result.firstWards = [];

    const firstWards = new Array<GameWardAggregationModel>();

    // Get Wards
    for (const game of gameList) {
      if (!game.wardsInfo) {
        continue;
      }

      const wardEvents = game.wardsInfo.events;
      if (!wardEvents) {
        continue;
      }

      // Set Max Game Duration
      const gameLength =
        (game.endTime.getTime() - game.startTime.getTime()) / 1000;
      if (result.maxGameLength < gameLength) {
        result.maxGameLength = gameLength;
      }

      for (const ward of wardEvents) {
        if (!ward) {
          continue;
        }

        // Filter out the wards placed by this player only.
        if (ward.summonerName != summonerName) {
          continue;
        }

        // Filter out by time range
        if (query.startTime && query.endTime) {
          if (
            ward.timeOffsetSeconds < query.startTime ||
            ward.timeOffsetSeconds > query.endTime
          ) {
            continue;
          }
        }

        // Filter out by team side
        if (query.teamSide && query.teamSide != ward.teamSide) {
          continue;
        }

        // Filter out by ward type
        if (query.wardType && query.wardType != ward.type) {
          continue;
        }

        if (
          !query.wardQueryType ||
          query.wardQueryType == WardQueryType.MostCommon
        ) {
          result.mostCommonWards.push(new GameWardAggregationModel(ward, 0));
        }

        if (
          !query.wardQueryType ||
          query.wardQueryType == WardQueryType.FirstWard
        ) {
          // Only get first one Ward and break.
          firstWards.push(new GameWardAggregationModel(ward, 0));
          break;
        }
      }
    }

    if (
      !query.wardQueryType ||
      query.wardQueryType == WardQueryType.FirstWard
    ) {

      var clusters: GameWardAggregationModel[] = [];
      for (const wardA of firstWards) {
        // Calculate clusters of each ward.
        let clusterSize = 0;
        const aggregateWard = new GameWardAggregationModel(
          new GameWardEventInfoModel(),
          0,
        );
        aggregateWard.wardEvent.coordinates = { x: 0, y: 0, z: 0 };
        aggregateWard.wardEvent.timeOffsetSeconds = 0;

        for (const wardB of firstWards) {
          const xDist =
            (wardA.wardEvent.coordinates.x - wardB.wardEvent.coordinates.x) /
            1000;
          const zDist =
            (wardA.wardEvent.coordinates.z - wardB.wardEvent.coordinates.z) /
            1000;
          const dist = xDist * xDist + zDist * zDist;
          const minDist = 4;
          if (dist < minDist) {
            aggregateWard.wardEvent.coordinates.x +=
              wardB.wardEvent.coordinates.x;
            aggregateWard.wardEvent.coordinates.y +=
              wardB.wardEvent.coordinates.y;
            aggregateWard.wardEvent.coordinates.z +=
              wardB.wardEvent.coordinates.z;
            aggregateWard.wardEvent.role = wardB.wardEvent.role;
            aggregateWard.wardEvent.summonerName = wardB.wardEvent.summonerName;
            aggregateWard.wardEvent.teamSide = wardB.wardEvent.teamSide;
            aggregateWard.wardEvent.timeOffsetSeconds +=
              wardB.wardEvent.timeOffsetSeconds;
            aggregateWard.wardEvent.type = wardB.wardEvent.type;
            clusterSize++;
          }
        }

        var percent = (clusterSize * 100) / firstWards.length;
        aggregateWard.percent = percent;

        const maxFirstWards = 3;
        if (clusters.length == 0) {
          clusters.push(aggregateWard);
        } else {
          let bFound = false;
          for (let i = 0; i < clusters.length; i++) {
            if (clusters[i].percent < percent) {
              clusters.splice(i, 0, aggregateWard);
              bFound = true;
              break;
            } else {
              const clusterCentroid =
                clusters[i].wardEvent.coordinates;
              const centroid = aggregateWard.wardEvent.coordinates;
              if (
                clusterCentroid.x == centroid.x &&
                clusterCentroid.z == centroid.z
              ) {
                bFound = true;
                break;
              }
            }
          }
          if (!bFound && clusters.length < maxFirstWards) {
            clusters.push(aggregateWard);
          }
        }

        if (clusters.length > maxFirstWards) {
          clusters.pop();
        }
      }

      for (const cluster of clusters) {
        result.firstWards.push(cluster);
      }
    }

    return result;
  }

  private getGeneralStats(
      player: GameUploadPlayerInfoModel,
  ): PlayerAnyGeneralStatsModelBase {
    switch (player.role) {
      case PlayerRole.Jungler:
        return player.stats.jungler?.general!;
      case PlayerRole.Support:
        return player.stats.support?.general!;
      case PlayerRole.Bottom:
        return player.stats.bottom?.general!;
      case PlayerRole.Middle:
        return player.stats.middle?.general!;
      default:
        return player.stats.top?.general!;
    }
  }

  private getPlayerChampionStats(
      player: GameUploadPlayerInfoModel,
      winGameCount: number,
      teamDmg: number,
      gameLengthInMins: number,
  ): PlayerChampionStatsModel {
    const generalStats = this.getGeneralStats(player);

    let avgKillCount = 0;
    let avgAssistCount = 0;
    let avgDeathCount = 0;
    let avgForwardPercent;

    let avgDmgPercent = 0;
    if (teamDmg > 0)
      avgDmgPercent =
          (generalStats.avgTotalDamage ? generalStats.avgTotalDamage : 0) /
          teamDmg;
    const avgGPM =
        (generalStats.avgGoldCount ? generalStats.avgGoldCount : 0) /
        gameLengthInMins;
    let avgGoldDifferenceCount = new PlayerAnyGamePeriodStatsModel();
    let avgCreepScoreDifferenceCount = new PlayerAnyGamePeriodStatsModel();

    // eslint-disable-next-line prefer-const
    avgForwardPercent = generalStats.avgForwardPercent;
    avgKillCount =
        generalStats.avgKillCount != undefined ? generalStats.avgKillCount : 0;
    avgDeathCount =
        generalStats.avgDeathCount != undefined
            ? generalStats.avgDeathCount
            : 0;
    avgAssistCount =
        generalStats.avgAssistCount != undefined
            ? generalStats.avgAssistCount
            : 0;

    if (player.role == PlayerRole.Bottom) {
      avgGoldDifferenceCount = player.stats.bottom?.laning
          .avgGoldDifferenceCount!;
      avgCreepScoreDifferenceCount = player.stats.bottom?.laning
          .avgCreepScoreDifferenceCount!;
    } else if (player.role == PlayerRole.Top) {
      avgGoldDifferenceCount = player.stats.top?.laning
          .avgGoldDifferenceCount!;
      avgCreepScoreDifferenceCount = player.stats.top?.laning
          .avgCreepScoreDifferenceCount!;
    } else if (player.role == PlayerRole.Middle) {
      avgGoldDifferenceCount = player.stats.middle?.laning
          .avgGoldDifferenceCount!;
      avgCreepScoreDifferenceCount = player.stats.middle?.laning
          .avgCreepScoreDifferenceCount!;
    }

    const pcs = new PlayerChampionStatsModel({
      championId: player.championId,
      role: player.role,
      gameCount: 1,
      winGameCount,
      avgKillCount,
      avgDeathCount,
      avgAssistCount,
      avgDmgPercent,
      avgForwardPercent,
      avgGPM,
      avgCreepScoreDifferenceCount,
      avgGoldDifferenceCount,
    });

    return pcs;
  }

  /**
   * Returns statistics about the champions of a player.
   * @param id The ID of the player.
   * @param query Query.
   */
  async findChampionStats(
    id: number,
    query: PlayerStatsQuery,
  ): Promise<PlayerChampionStatsModel[]> {
    let dbQuery = this.gameRepository.createQueryBuilder().where('1 = 1');

    if (query.dateRange?.start != undefined) {
      dbQuery = dbQuery.andWhere(
        `${GameEntity.metadata.startTime} >= :startTime`,
        { startTime: query.dateRange.start },
      );
    }
    if (query.dateRange?.end != undefined) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.endTime} <= :endTime`, {
        endTime: query.dateRange.end,
      });
    }
    if (query.gameType != undefined) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.type} = :type`, {
        type: query.gameType,
      });
    }
    if (query.regionId != undefined) {
      dbQuery = dbQuery.andWhere(
        `${GameEntity.metadata.regionId} = :regionId`,
        { regionId: query.regionId.toLowerCase() },
      );
    }
    if (query.patchId != undefined) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.patchId} = :patchId`, {
        patchId: query.patchId.toLowerCase(),
      });
    }

    let gameList = await dbQuery.getMany();

    const gamePlayerList = await this.gamePlayerEntityRepository.find({
      where: {
        gameId: Any(gameList.map(x => x.id)),
      },
    });

    // filter out games by player's id, teamSide, versusPlayerId

    gameList = gameList.filter((game: GameEntity) => {
      let result = gamePlayerList.find((gamePlayer: GamePlayerEntity) => {
        if (query.teamSide && query.teamSide != gamePlayer.teamSide)
          return false;
        return gamePlayer.gameId == game.id && gamePlayer.playerId == id;
      });

      if (!result) return false;

      if (query.versusPlayerId) {
        result = gamePlayerList.find((gamePlayer: GamePlayerEntity) => {
          if (query.teamSide && query.teamSide == gamePlayer.teamSide)
            return false;
          return (
            gamePlayer.gameId == game.id &&
            gamePlayer.playerId == query.versusPlayerId
          );
        });
        if (!result) return false;
      }
      return true;
    });

    const championStatsMap = new Map();

    gameList.forEach((game: GameEntity) => {
      const gamePlayer = gamePlayerList.find((gamePlayer: GamePlayerEntity) => {
        if (query.teamSide && query.teamSide != gamePlayer.teamSide)
          return false;
        return gamePlayer.gameId == game.id && gamePlayer.playerId == id;
      })!;

      const summonerId = gamePlayer.summonerId;
      let winGameCount = 0;
      let teamInfo = game.redTeamInfo;
      if (gamePlayer.teamSide == GameTeamSide.Blue)
        teamInfo = game.blueTeamInfo;
      if (game.winnerTeamSide == gamePlayer.teamSide) winGameCount = 1;

      const mainPlayer = teamInfo.players.find(
        x => x.summonerIdentity.id == summonerId,
      )!;

      let teamDmg = 0;

      for (let i = 0; i < teamInfo.players.length; i++) {
        const generalStats = this.getGeneralStats(teamInfo.players[i]);
        teamDmg += generalStats.avgTotalDamage
          ? generalStats.avgTotalDamage
          : 0;
      }

      const gameLengthInMins =
        (game.endTime.getTime() - game.startTime.getTime()) / 1000 / 60;
      const stats = this.getPlayerChampionStats(
        mainPlayer,
        winGameCount,
        teamDmg,
        gameLengthInMins,
      );

      const key = stats.championId * 10 + stats.role;
      const championStats = championStatsMap.get(key);
      if (championStats == undefined) championStatsMap.set(key, stats);
      else {
        championStats.add(stats);
        championStatsMap.set(key, championStats);
      }
      return stats;
    });

    const result: PlayerChampionStatsModel[] = [];

    for (const entry of championStatsMap.entries()) {
      result.push(entry[1].average());
    }

    return result;
  }
}
