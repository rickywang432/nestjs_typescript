import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  FindManyOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { GameEntity, TeamEntity, TeamMemberEntity } from '../data-entities';
import {
  GameTeamSide,
  GameType,
  GameUploadPlayerInfoModel,
  GameUploadTeamInfoModel,
  MatchupStatsModel,
  PlayerAnyGeneralStatsModelBase,
  PlayerAnyLaningStatsModelBase,
  PlayerRole,
  QueryResult,
  TeamChampionsStatsModel,
  TeamChampionsStatsQuery,
  TeamMatchHistoryStatsModel,
  TeamMatchHistoryStatsQuery,
  TeamMemberProfileNestedModel,
  TeamOverallStatsModel,
  TeamOverallStatsWithRelationsModel,
  TeamProfileLightModel,
  TeamProfileModel,
  TeamProfileNestedModel,
  TeamQuery,
  TeamStatsQuery,
  TeamStatsQueryBaseModel,
  TeamMemberProfileModel,
  GameDragonInfoModel,
  GameBaronEventInfoModel,
  TeamWardQuery,
  WardResponse,
  WardQueryType,
  GameWardAggregationModel,
  TeamMatchHistoryQuerySort,
  SortOrder,
  GameWardEventInfoModel,
} from '../models';
import { ILike } from '../tools/typeorm-ext';
import { DbUtils } from './db-utils';
import { TeamStatsAggregationService } from './team-stats-aggregation.service';

interface TeamPlayerStatsModel {
  general: PlayerAnyGeneralStatsModelBase;
  laning?: PlayerAnyLaningStatsModelBase;
}

class TeamMatchStatsModel {
  soloKillsCount: number;
  isoDeathsCount: number;
  goldDiffPre15: number;
  goldDiffPost15: number;
  csDiffPre15: number;
  csDiffPost15: number;
  dragonSecuredPercent: number;
  baronSecuredPercent: number;
}

const sortByMap: {
  [key in TeamMatchHistoryQuerySort]: string;
} = {
  [TeamMatchHistoryQuerySort.SoloKills]: 'solo_kills_count',
  [TeamMatchHistoryQuerySort.IsolatedDeaths]: 'iso_deaths_count',
  [TeamMatchHistoryQuerySort.GoldDiffPre15]: 'gold_diff_pre15',
  [TeamMatchHistoryQuerySort.GoldDiffPost15]: 'gold_diff_post15',
  [TeamMatchHistoryQuerySort.CSDiffPre15]: 'cs_diff_pre15',
  [TeamMatchHistoryQuerySort.CSDiffPost15]: 'cs_diff_post15',
  [TeamMatchHistoryQuerySort.DragonsSecuredPercent]: 'dragon_secure_percent',
  [TeamMatchHistoryQuerySort.BaronSecuredPercent]: 'baron_secure_percent',
};

const sortOrderMap: {
  [key in SortOrder]: 'ASC' | 'DESC';
} = {
  [SortOrder.Asc]: 'ASC',
  [SortOrder.Desc]: 'DESC',
};

/**
 * Provides access to team data.
 */
@Injectable()
export class TeamsDataService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
    @InjectRepository(TeamMemberEntity)
    private readonly teamMemberRepository: Repository<TeamMemberEntity>,
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) { }

  /**
   * Returns the information about a team member.
   * @param name The name of the member.
   * @param activeOnly Indicates if only active team members should be returned.
   */
  async getTeamMemberProfileByName(
    name: string,
    activeOnly = false,
  ): Promise<TeamMemberProfileModel | undefined> {
    const dbTeamMember = await this.teamMemberRepository.findOne({
      where: { nameId: name.toLowerCase() },
    });

    if (
      dbTeamMember == undefined ||
      (activeOnly && dbTeamMember.isActive == false)
    ) {
      return undefined;
    }

    const dbTeam = await this.teamRepository.findOne(dbTeamMember.teamId);

    if (dbTeam == undefined || (activeOnly && dbTeam.isActive == false)) {
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

  /**
   * Searches for teams.
   * @param query Query.
   */
  async find(query: TeamQuery): Promise<QueryResult<TeamProfileLightModel>> {
    const dbQuery: FindManyOptions<TeamEntity> = {};

    if (query.text != undefined) {
      dbQuery.where = { name: ILike(`%${query.text}%`) };
    }

    DbUtils.addPagination(dbQuery, query);

    const [dbItemList, totalCount] = await this.teamRepository.findAndCount(
      dbQuery,
    );

    const itemList = dbItemList.map(
      x =>
        new TeamProfileLightModel({
          id: x.id,
          name: x.name,
          type: x.type,
          regionId: x.regionId,
          logoUrl: x.logoUrl,
        }),
    );

    return new QueryResult<TeamProfileLightModel>(
      itemList,
      totalCount,
      query.pagination,
    );
  }

  /**
   * Returns information about a team.
   * @param id The ID of the team.
   */
  async getProfile(id: number): Promise<TeamProfileModel | undefined> {
    const dbTeam = await this.teamRepository.findOne(id);

    if (dbTeam == undefined) {
      return undefined;
    }

    const dbTeamMemberList = await this.teamMemberRepository.find({
      where: { teamId: id, isActive: true },
    });

    return new TeamProfileModel({
      id: dbTeam.id,
      name: dbTeam.name,
      type: dbTeam.type,
      regionId: dbTeam.regionId,
      logoUrl: dbTeam.logoUrl,
      members: dbTeamMemberList.map(
        x =>
          new TeamMemberProfileNestedModel({
            id: x.id,
            name: x.name,
            playerId: x.playerId,
            pictureUrl: x.pictureUrl,
            role: x.role,
            isActive: x.isActive,
          }),
      ),
    });
  }

  private getPlayerStatsDependingRole(
    player: GameUploadPlayerInfoModel,
  ): TeamPlayerStatsModel | undefined {
    return player.role == PlayerRole.Top
      ? player.stats.top
      : player.role == PlayerRole.Middle
        ? player.stats.middle
        : player.role == PlayerRole.Bottom
          ? player.stats.bottom
          : player.role == PlayerRole.Jungler
            ? player.stats.jungler
            : player.role == PlayerRole.Support
              ? player.stats.support
              : undefined;
  }

  /**
   * Calculate a team's stats in a game.
   * @param team Information of the uploaded team
   */
  getTeamMatchStats(team: GameUploadTeamInfoModel): TeamMatchStatsModel {
    const soloKillsCount = team.players.reduce((m, p) => {
      const stats = this.getPlayerStatsDependingRole(p);
      if (stats) {
        m = m + (stats.general.avgSoloKillCount.total || 0);
      }
      return m;
    }, 0);

    const isoDeathsCount = team.players.reduce((m, p) => {
      const stats = this.getPlayerStatsDependingRole(p);
      if (stats) {
        m = m + (stats.general.avgIsolatedDeathCount.total || 0);
      }
      return m;
    }, 0);

    const goldDiffPre15 = team.players.reduce((m, p) => {
      const stats = this.getPlayerStatsDependingRole(p);
      if (stats && stats.laning) {
        m = m + (stats.laning.avgGoldDifferenceCount.min15 || 0);
      }
      return m;
    }, 0);
    const goldCountTotal = team.players.reduce((m, p) => {
      const stats = this.getPlayerStatsDependingRole(p);
      if (stats) {
        m = m + (stats.general.avgGoldCount || 0);
      }
      return m;
    }, 0);
    const goldDiffPost15 = goldCountTotal - goldDiffPre15;

    const csDiffPre15 = team.players.reduce((m, p) => {
      const stats = this.getPlayerStatsDependingRole(p);
      if (stats && stats.laning) {
        m = m + (stats.laning.avgCreepScoreDifferenceCount.min15 || 0);
      }
      return m;
    }, 0);
    const csDiffTotal = team.players.reduce((m, p) => {
      const stats = this.getPlayerStatsDependingRole(p);
      if (stats && stats.laning) {
        m = m + (stats.laning.avgCreepScoreDifferenceCount.total || 0);
      }
      return m;
    }, 0);
    const csDiffPost15 = csDiffTotal - csDiffPre15;

    let dragonSecuredPercent = 0;
    const dragonsInfo: GameDragonInfoModel | undefined =
      team.stats?.objectives.dragons;
    if (dragonsInfo) {
      const totalTaken =
        (dragonsInfo.cloudDragon?.killedCount || 0) +
        (dragonsInfo.infernalDragon?.killedCount || 0) +
        (dragonsInfo.mountainDragon?.killedCount || 0) +
        (dragonsInfo.oceanDragon?.killedCount || 0);
      const totalAvailable =
        (dragonsInfo.cloudDragon?.totalCount || 0) +
        (dragonsInfo.infernalDragon?.totalCount || 0) +
        (dragonsInfo.mountainDragon?.totalCount || 0) +
        (dragonsInfo.oceanDragon?.totalCount || 0);
      if (totalAvailable > 0) {
        dragonSecuredPercent = (totalTaken / totalAvailable) * 100;
      }
    }

    let baronSecuredPercent = 0;
    const baronInfo: GameBaronEventInfoModel | undefined =
      team.stats?.objectives.baron;
    if (baronInfo && baronInfo.totalCount > 0) {
      baronSecuredPercent =
        (baronInfo.killedCount / baronInfo.totalCount) * 100;
    }

    return {
      soloKillsCount,
      isoDeathsCount,
      goldDiffPre15,
      goldDiffPost15,
      csDiffPre15,
      csDiffPost15,
      dragonSecuredPercent,
      baronSecuredPercent,
    };
  }

  /**
   *
   * @param teamId The ID of the team
   * @param query The base query for team stats
   */
  private getBasicQueryBuilder(
    teamId: number,
    query: TeamStatsQueryBaseModel,
  ): SelectQueryBuilder<GameEntity> {
    let dbQuery = this.gameRepository.createQueryBuilder('game').where('1 = 1');

    if (query.dateRange?.start) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.startTime} >= :startTime`, {
        startTime: query.dateRange.start
      });
    } else if (query.dateRange?.end) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.endTime} <= :endTime`, {
        endTime: query.dateRange.end
      });
    } else if (query.gameType) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.type} = :type`, {
        type: query.gameType
      });
    } else if (query.patchId) {
      dbQuery = dbQuery.andWhere(`${GameEntity.metadata.patchId} = :patchId`, {
        patchId: query.patchId.toLowerCase()
      });
    }

    if (!query.versusTeamId && query.teamSide) {
      if (query.teamSide == GameTeamSide.Red) {
        dbQuery = dbQuery.andWhere(`${GameEntity.metadata.redTeamId} = :redTeamId`, { redTeamId: teamId });
      } else if (query.teamSide == GameTeamSide.Blue) {
        dbQuery = dbQuery.andWhere(`${GameEntity.metadata.blueTeamId} = :blueTeamId`, { blueTeamId: teamId });
      }
    } else if (query.versusTeamId && !query.teamSide) {
      dbQuery.andWhere(
        new Brackets(qb => {
          qb.where(
            new Brackets(qba => {
              qba
                .where(`${GameEntity.metadata.redTeamId} = :redTeamId1`, { redTeamId1: teamId })
                .andWhere(`${GameEntity.metadata.blueTeamId} = :blueTeamId1`, { blueTeamId1: query.versusTeamId });
            })
          ).orWhere(
            new Brackets(qbb => {
              qbb
                .where(`${GameEntity.metadata.redTeamId} = :redTeamId2`, { redTeamId2: query.versusTeamId })
                .andWhere(`${GameEntity.metadata.blueTeamId} = :blueTeamId2`, { blueTeamId2: teamId });
            })
          );
        })
      );
     
    } else if (query.versusTeamId && query.teamSide) {
      if (query.teamSide == GameTeamSide.Red) {
        dbQuery = dbQuery.andWhere(`${GameEntity.metadata.blueTeamId} = :blueTeamId`, {
          blueTeamId: query.versusTeamId
        });
      } else if (query.teamSide == GameTeamSide.Blue) {
        dbQuery = dbQuery.andWhere(`${GameEntity.metadata.redTeamId} = :redTeamId`, {
          redTeamId: query.versusTeamId
        });
      }
    } else {
      dbQuery.andWhere(
        new Brackets(qb => {
          qb.where(`${GameEntity.metadata.redTeamId} = :redTeamId`, {
            redTeamId: teamId
          }).orWhere(`${GameEntity.metadata.blueTeamId} = :blueTeamId`, {
            blueTeamId: teamId
          });
        })
      );
    }

    return dbQuery;
  }

  /**
   * Returns statistics about a team.
   * @param id The ID of the team.
   * @param query Query.
   */
  async findStats(
    id: number,
    query: TeamStatsQuery,
  ): Promise<TeamOverallStatsWithRelationsModel> {
    const primaryDbQuery = this.getBasicQueryBuilder(id, query)
      .orderBy(GameEntity.metadata.startTime, 'DESC')
      .limit(query.compareToLastNMatchCount ? 30 : 15);

    let compareToDbQuery = undefined;
    const queryForCompareTo: TeamStatsQueryBaseModel = {
      ...query,
      versusTeamId: undefined,
      gameType: GameType.Competitive,
    };

    if (query.compareToTeamId) {
      compareToDbQuery = this.getBasicQueryBuilder(
        query.compareToTeamId,
        queryForCompareTo,
      )
        .orderBy(GameEntity.metadata.startTime, 'DESC')
        .limit(15);
    }

    const primaryGamesList = await primaryDbQuery.getMany();
    const primaryOverallStats: TeamOverallStatsModel = await TeamStatsAggregationService.aggregateTeamStats(
      id,
      primaryGamesList,
    );

    let secondaryOverallStats: TeamOverallStatsModel | undefined = undefined;

    if (query.versusTeamId) {
      secondaryOverallStats = await TeamStatsAggregationService.aggregateTeamStats(
        query.versusTeamId,
        primaryGamesList,
      );
    } else if (query.compareToLastNMatchCount) {
      console.log('compareToLastNMatchCount');
    } else if (query.compareToTeamId) {
      const gamesList = await compareToDbQuery?.getMany();
      secondaryOverallStats = await TeamStatsAggregationService.aggregateTeamStats(
        query.compareToTeamId,
        gamesList!,
      );
    }

    return new TeamOverallStatsWithRelationsModel({
      primaryOverallStats,
      secondaryOverallStats,
    });
  }

  /**
   * Returns statistics about wards of a team.
   * @param id The ID of the team.
   * @param query Query.
   */
  async getWardsInfo(id: number, query: TeamWardQuery): Promise<WardResponse> {
    // Error Checking
    if (query == undefined) {
      throw new Error('undefined');
    }

    // Fetch DB
    const dbQuery = this.getBasicQueryBuilder(id, query)
    .orderBy(GameEntity.metadata.startTime, 'DESC')
    .limit(query.maxItemCount ? query.maxItemCount : 15);

    const gameList = await dbQuery.getMany();

    // Return Wards
    const result = new WardResponse();
    result.maxGameLength = 0;
    result.mostCommonWards = [];
    result.firstWards = [];
    const firstWards = {
      [PlayerRole.Top.toString()]: new Array<GameWardAggregationModel>(),
      [PlayerRole.Middle.toString()]: new Array<GameWardAggregationModel>(),
      [PlayerRole.Bottom.toString()]: new Array<GameWardAggregationModel>(),
      [PlayerRole.Jungler.toString()]: new Array<GameWardAggregationModel>(),
      [PlayerRole.Support.toString()]: new Array<GameWardAggregationModel>(),
    };

    // Get  Wards
    for (const game of gameList) {
      if (!game.wardsInfo) {
        continue;
      }

      const wardEvents = game.wardsInfo.events;
      if (!wardEvents) {
        continue;
      }

      const laneWards = {
        [PlayerRole.Top.toString()]: new Array<GameWardAggregationModel>(),
        [PlayerRole.Middle.toString()]: new Array<GameWardAggregationModel>(),
        [PlayerRole.Bottom.toString()]: new Array<GameWardAggregationModel>(),
        [PlayerRole.Jungler.toString()]: new Array<GameWardAggregationModel>(),
        [PlayerRole.Support.toString()]: new Array<GameWardAggregationModel>(),
      };
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

        // Filer out the wards only placed by the team.
        if (id == game.redTeamId && ward.teamSide != GameTeamSide.Red) {
          continue;
        }

        if (id == game.blueTeamId && ward.teamSide != GameTeamSide.Blue) {
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
          // Get only first ward of each role.
          if (ward.role != PlayerRole.Unknown && ward.role != undefined) {
            if (laneWards[ward.role].length == 0) {
              laneWards[ward.role].push(new GameWardAggregationModel(ward, 0));
            }
          }
        }
      }

      for (const role in laneWards) {
        firstWards[role] = firstWards[role].concat(laneWards[role]);
      }
    }

    if (
      !query.wardQueryType ||
      query.wardQueryType == WardQueryType.FirstWard
    ) {
      // Aggregate wards of each role.
      for (const role in firstWards) {
        // Find a ward position with maximum percentage of usage.
        let maxClusterSize = 0;
        let laneFirstWard = new GameWardAggregationModel(
          new GameWardEventInfoModel(),
          0,
        );
        const wards = firstWards[role];
        for (const wardA of wards) {
          // Calculate clusters of each ward.
          let clusterSize = 0;
          const aggregateWard = new GameWardAggregationModel(
            new GameWardEventInfoModel(),
            0,
          );
          aggregateWard.wardEvent.coordinates = { x: 0, y: 0, z: 0 };
          aggregateWard.wardEvent.timeOffsetSeconds = 0;

          for (const wardB of wards) {
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
              aggregateWard.wardEvent.summonerName =
                wardB.wardEvent.summonerName;
              aggregateWard.wardEvent.teamSide = wardB.wardEvent.teamSide;
              aggregateWard.wardEvent.timeOffsetSeconds +=
                wardB.wardEvent.timeOffsetSeconds;
              aggregateWard.wardEvent.type = wardB.wardEvent.type;
              clusterSize++;
            }
          }

          if (maxClusterSize < clusterSize) {
            aggregateWard.wardEvent.coordinates.x /= clusterSize;
            aggregateWard.wardEvent.coordinates.y /= clusterSize;
            aggregateWard.wardEvent.coordinates.z /= clusterSize;
            aggregateWard.wardEvent.timeOffsetSeconds /= clusterSize;
            aggregateWard.percent = (clusterSize * 100) / wards.length;

            maxClusterSize = clusterSize;
            laneFirstWard = aggregateWard;
          }
        }

        result.firstWards.push(laneFirstWard);
      }
    }

    return result;
  }

  /**
   *
   * Return statistics about the champions of the team.
   * @param id The ID of the team.
   * @param query Query.
   */
  async findChampionsStats(
    id: number,
    query: TeamChampionsStatsQuery,
  ): Promise<TeamChampionsStatsModel[]> {
    const dbQuery = this.getBasicQueryBuilder(id, query).orderBy(
      GameEntity.metadata.startTime,
      'DESC',
    );
    const [gamesList, gamesCount] = await dbQuery.getManyAndCount();
    const championsItems: {
      championId: number;
      roleId: PlayerRole;
      winMatch: number;
      totalMatch: number;
      championBannedBy: number;
      championBannedAgainst: number;
      matchups: {
        championId: number;
        matchCnt: number;
        winCnt: number;
      }[];
    }[] = [];
    let totalBannedBy = 0;
    let totalBannedAgainst = 0;
    gamesList.forEach(g => {
      const myTeam: GameUploadTeamInfoModel =
        g.redTeamId == id ? g.redTeamInfo : g.blueTeamInfo;
      const enemyTeam: GameUploadTeamInfoModel =
        g.redTeamId == id ? g.blueTeamInfo : g.redTeamInfo;
      totalBannedBy += myTeam.bannedChampionIds
        ? myTeam.bannedChampionIds.length
        : 0;
      totalBannedAgainst += enemyTeam.bannedChampionIds
        ? enemyTeam.bannedChampionIds.length
        : 0;
      let isWin = 1;
      if (
        (g.redTeamId == id && g.winnerTeamSide == 1) ||
        (g.blueTeamId == id && g.winnerTeamSide == 2)
      )
        isWin = 1;
      else isWin = 0;

      for (let i = 0; i < 5; i++) {
        const objIndex = championsItems.findIndex(
          obj =>
            obj.championId == myTeam.players[i].championId &&
            obj.roleId == myTeam.players[i].role,
        );
        let matchupChampionId = 0;
        const matchupIndex = enemyTeam.players.findIndex(
          obj => obj.role == myTeam.players[i].role,
        );
        matchupChampionId = enemyTeam.players[matchupIndex].championId;
        if (objIndex == -1) {
          const tempMatchups = [];
          tempMatchups.push({
            championId: matchupChampionId,
            matchCnt: 1,
            winCnt: isWin,
          });
          if (query.role && query.championId) {
            if (
              query.role == myTeam.players[i].role &&
              query.championId == myTeam.players[i].championId
            )
              championsItems.push({
                championId: myTeam.players[i].championId,
                roleId: myTeam.players[i].role,
                winMatch: isWin,
                totalMatch: 1,
                championBannedBy: !myTeam.bannedChampionIds
                  ? 0
                  : myTeam.bannedChampionIds.indexOf(
                    myTeam.players[i].championId,
                  ) > -1
                    ? 1
                    : 0,
                championBannedAgainst: !myTeam.bannedChampionIds
                  ? 0
                  : myTeam.bannedChampionIds.indexOf(
                    myTeam.players[i].championId,
                  ) > -1
                    ? 1
                    : 0,
                matchups: tempMatchups,
              });
          } else if (query.role) {
            if (query.role == myTeam.players[i].role)
              championsItems.push({
                championId: myTeam.players[i].championId,
                roleId: myTeam.players[i].role,
                winMatch: isWin,
                totalMatch: 1,
                championBannedBy: !myTeam.bannedChampionIds
                  ? 0
                  : myTeam.bannedChampionIds.indexOf(
                    myTeam.players[i].championId,
                  ) > -1
                    ? 1
                    : 0,
                championBannedAgainst: !myTeam.bannedChampionIds
                  ? 0
                  : myTeam.bannedChampionIds.indexOf(
                    myTeam.players[i].championId,
                  ) > -1
                    ? 1
                    : 0,
                matchups: tempMatchups,
              });
          } else if (query.championId) {
            if (query.championId == myTeam.players[i].championId)
              championsItems.push({
                championId: myTeam.players[i].championId,
                roleId: myTeam.players[i].role,
                winMatch: isWin,
                totalMatch: 1,
                championBannedBy: !myTeam.bannedChampionIds
                  ? 0
                  : myTeam.bannedChampionIds.indexOf(
                    myTeam.players[i].championId,
                  ) > -1
                    ? 1
                    : 0,
                championBannedAgainst: !myTeam.bannedChampionIds
                  ? 0
                  : myTeam.bannedChampionIds.indexOf(
                    myTeam.players[i].championId,
                  ) > -1
                    ? 1
                    : 0,
                matchups: tempMatchups,
              });
          } else {
            championsItems.push({
              championId: myTeam.players[i].championId,
              roleId: myTeam.players[i].role,
              winMatch: isWin,
              totalMatch: 1,
              championBannedBy: !myTeam.bannedChampionIds
                ? 0
                : myTeam.bannedChampionIds.indexOf(
                  myTeam.players[i].championId,
                ) > -1
                  ? 1
                  : 0,
              championBannedAgainst: !myTeam.bannedChampionIds
                ? 0
                : myTeam.bannedChampionIds.indexOf(
                  myTeam.players[i].championId,
                ) > -1
                  ? 1
                  : 0,
              matchups: tempMatchups,
            });
          }
        } else {
          championsItems[objIndex].totalMatch += 1;
          championsItems[objIndex].winMatch += isWin;
          championsItems[objIndex].championBannedBy += !myTeam.bannedChampionIds
            ? 0
            : myTeam.bannedChampionIds.indexOf(myTeam.players[i].championId) >
              -1
              ? 1
              : 0;
          championsItems[
            objIndex
          ].championBannedAgainst += !enemyTeam.bannedChampionIds
              ? 0
              : enemyTeam.bannedChampionIds.indexOf(
                myTeam.players[i].championId,
              ) > -1
                ? 1
                : 0;
          const tempMatchupIndex = championsItems[objIndex].matchups.findIndex(
            obj => obj.championId == matchupChampionId,
          );
          if (tempMatchupIndex == -1) {
            championsItems[objIndex].matchups.push({
              championId: matchupChampionId,
              matchCnt: 1,
              winCnt: isWin,
            });
          } else {
            championsItems[objIndex].matchups[tempMatchupIndex].matchCnt += 1;
            championsItems[objIndex].matchups[tempMatchupIndex].winCnt += isWin;
          }
        }
      }
    });

    const championsResult = championsItems.map(g => {
      const roleId = g.roleId;
      const championId = g.championId;
      const winRate =
        g.totalMatch == 0
          ? 0
          : Math.round((g.winMatch / g.totalMatch) * 100 * 10) / 10;

      const bannedByRate =
        totalBannedBy == 0
          ? 0
          : Math.round((g.championBannedBy / totalBannedBy) * 100 * 10) / 10;
      const bannedAgainstRate =
        totalBannedAgainst == 0
          ? 0
          : Math.round(
            (g.championBannedAgainst / totalBannedAgainst) * 100 * 10,
          ) / 10;
      const pickRate =
        gamesCount == 0
          ? 0
          : Math.round((g.totalMatch / gamesCount) * 100 * 10) / 10;
      const matchesCount = g.totalMatch;
      g.matchups.sort((a, b) =>
        a.winCnt / a.matchCnt < b.winCnt / b.matchCnt
          ? -1
          : a.winCnt / a.matchCnt > b.winCnt / b.matchCnt
            ? 1
            : 0,
      );
      g.matchups = g.matchups.slice(0, 4);
      const matchups = g.matchups.map(t => {
        return new MatchupStatsModel({
          championId: t.championId,
          winRate: parseFloat(((t.winCnt / t.matchCnt) * 100).toFixed(1)),
        });
      });
      return new TeamChampionsStatsModel({
        roleId,
        championId,
        winRate,
        bannedByRate,
        bannedAgainstRate,
        pickRate,
        matchups,
        matchesCount,
      });
    });
    return championsResult;
  }

  /**
   *
   * Return statistics about the match history of a team.
   * @param id The ID of the team.
   * @param query Query.
   */
  async findMatchHistoryStats(
    id: number,
    query: TeamMatchHistoryStatsQuery,
  ): Promise<QueryResult<TeamMatchHistoryStatsModel>> {
    let dbQuery = this.getBasicQueryBuilder(id, query);

    if (query.victoryOnly) {
      dbQuery.andWhere(
        new Brackets(qb => {
          qb.andWhere(
            `${GameEntity.metadata.winnerTeamSide} = :winnerTeamSide1 and ${GameEntity.metadata.redTeamId} = :redTeamId`,
            { winnerTeamSide1: GameTeamSide.Red, redTeamId: id },
          ).orWhere(
            `${GameEntity.metadata.winnerTeamSide} = :winnerTeamSide2 and ${GameEntity.metadata.blueTeamId} = :blueTeamId`,
            { winnerTeamSide2: GameTeamSide.Blue, blueTeamId: id },
          );
        }),
      );
    }

    dbQuery.leftJoinAndSelect('game.matchStats', 'match_stats');

    if (query.sortBy) {
      const sortBy = sortByMap[query.sortBy];
      const sortOrder = query.sortOrder
        ? sortOrderMap[query.sortOrder]
        : sortOrderMap[SortOrder.Desc];

      if (!query.teamSide) {
        const selection = `match_stats.rt_${sortBy} + match_stats.bt_${sortBy}`;

        dbQuery = dbQuery.addSelect(selection, sortBy);
      } else if (query.teamSide === GameTeamSide.Red) {
        const selection = `match_stats.rt_${sortBy}`;

        dbQuery = dbQuery.addSelect(selection, sortBy);
      } else if (query.teamSide === GameTeamSide.Blue) {
        const selection = `match_stats.bt_${sortBy}`;

        dbQuery = dbQuery.addSelect(selection, sortBy);
      }

      dbQuery.orderBy(sortBy, sortOrder);
    } else {
      dbQuery
        .addSelect(`game.${GameEntity.metadata.startTime}`, 'start_time')
        .orderBy('start_time', 'DESC');
    }

    DbUtils.addPagination(dbQuery, query);

    const [gamesList, totalCount] = await dbQuery.getManyAndCount();

    const enemyTeamIds: number[] = [];
    gamesList.forEach(g => {
      const enemyTeamId: number | undefined =
        g.redTeamId == id ? g.blueTeamId : g.redTeamId;

      if (enemyTeamId && enemyTeamIds.indexOf(enemyTeamId) === -1) {
        enemyTeamIds.push(enemyTeamId);
      }
    });

    const enemyTeamsDict: {
      [teamId: number]: TeamEntity;
    } = {};
    const promises: Promise<TeamEntity | undefined>[] = enemyTeamIds.map(
      enemyTeamId =>
        this.teamRepository.findOne({
          where: { id: enemyTeamId },
        }),
    );
    const enemyTeamsList = await Promise.all(promises);
    enemyTeamsList.forEach(enemyTeam => {
      if (!enemyTeam) return;
      if (enemyTeamsDict[enemyTeam.id]) return;
      enemyTeamsDict[enemyTeam.id] = enemyTeam;
    });

    const matchHistoryItems = gamesList
      .filter(g => {
        const enemyTeamId: number =
          g.redTeamId == id ? g.blueTeamId! : g.redTeamId!;
        return enemyTeamsDict[enemyTeamId];
      })
      .map(g => {
        let matchStats: TeamMatchStatsModel;
        if (g.redTeamId === id) {
          matchStats = {
            soloKillsCount: g.matchStats.redTeamSoloKillsCount,
            isoDeathsCount: g.matchStats.redTeamIsolatedDeathsCount,
            goldDiffPre15: g.matchStats.redTeamGoldDiffPre15,
            goldDiffPost15: g.matchStats.redTeamGoldDiffPost15,
            csDiffPre15: g.matchStats.redTeamCsDiffPre15,
            csDiffPost15: g.matchStats.redTeamCsDiffPost15,
            dragonSecuredPercent: g.matchStats.redTeamDragonSecuredPercent,
            baronSecuredPercent: g.matchStats.redTeamBaronSecuredPercent,
          };
        } else {
          matchStats = {
            soloKillsCount: g.matchStats.blueTeamSoloKillsCount,
            isoDeathsCount: g.matchStats.blueTeamIsolatedDeathsCount,
            goldDiffPre15: g.matchStats.blueTeamGoldDiffPre15,
            goldDiffPost15: g.matchStats.blueTeamGoldDiffPost15,
            csDiffPre15: g.matchStats.blueTeamCsDiffPre15,
            csDiffPost15: g.matchStats.blueTeamCsDiffPost15,
            dragonSecuredPercent: g.matchStats.blueTeamDragonSecuredPercent,
            baronSecuredPercent: g.matchStats.blueTeamBaronSecuredPercent,
          };
        }

        const enemyTeamId: number =
          g.redTeamId == id ? g.blueTeamId! : g.redTeamId!;
        const enemyTeam = enemyTeamsDict[enemyTeamId];

        return new TeamMatchHistoryStatsModel({
          ...matchStats,
          gameId: g.id,
          gameUid: g.uid,
          gameTeamSide:
            g.redTeamId === id ? GameTeamSide.Red : GameTeamSide.Blue,
          enemyTeamId: enemyTeam.id,
          enemyTeamName: enemyTeam.name,
          gameDurationSeconds:
            (g.endTime.valueOf() - g.startTime.valueOf()) / 1000,
          gameType: g.type,
          gameStartTime: g.startTime,
          gamePatch: g.patchId,
        });
      });

    return new QueryResult(matchHistoryItems, totalCount, query.pagination);
  }
}
