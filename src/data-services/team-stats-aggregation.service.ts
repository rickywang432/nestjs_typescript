import {
  GameEntity,
} from '../data-entities';
import {
  GameUploadTeamInfoModel,
  PlayerRole,
  TeamOverallStatsModel,
  ChampionPickInfoModel,
  ChampionStatsModel,
  MostPickedRolesByOrderModel,
  DragonKillInfoModel,
  ElementalDragonsInfoModel,
  TurretPlatesTakenResponseInfoModel,
  LaningInfoModel,
  GameTeamSide,
  LaneInteractionInfoModel,
  TurretPlateTakenByRoleResponseModel,
  GankInfoModel,
  LaningBasicInfoModel,
} from '../models';

/**
 * Provides access to team data.
 */
export class TeamStatsAggregationService {

  /*
  Aggregate blind/counter picks
  * @param id The ID of the team
  * @param gamesList The games that the team had played in
  */
  static calculatePicksFor(
    id: number,
    gamesList: GameEntity[]
  ): [ChampionPickInfoModel[], ChampionPickInfoModel[]] {

    const resultsForBlind: ChampionPickInfoModel[] = [];
    const resultsForCounter: ChampionPickInfoModel[] = [];

    const allRoles = [PlayerRole.Top,
    PlayerRole.Middle,
    PlayerRole.Bottom,
    PlayerRole.Jungler,
    PlayerRole.Support,
    ];

    allRoles.forEach(role => {
      resultsForBlind.push(new ChampionPickInfoModel({
        roleId: role,
        picksCount: 0,
      }));
      resultsForCounter.push(new ChampionPickInfoModel({
        roleId: role,
        picksCount: 0,
      }));
    });

    gamesList.forEach(gameEntity => {
      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      allRoles.forEach(role => {
        const blindSum = resultsForBlind.find(r => r.roleId == role);
        const blindPick = myTeam.blindPicks != undefined ? myTeam.blindPicks.find(r => r.roleId == role) : undefined;
        if (blindSum != undefined && blindPick != undefined) {
          blindSum.picksCount += blindPick.picksCount;
        }

        const counterSum = resultsForCounter.find(r => r.roleId == role);
        const counterPick = myTeam.counterPicks != undefined ? myTeam.counterPicks.find(r => r.roleId == role) : undefined;
        if (counterSum != undefined && counterPick != undefined) {
          counterSum.picksCount += counterPick.picksCount;
        }
      });
    });

    return [resultsForBlind, resultsForCounter];
  }

  /*
  Aggregate picks
  * @param id The ID of the team
  * @param gamesList The games that the team had played in
  */
  static calculateChampionsStatsFor(
    id: number,
    gamesList: GameEntity[]
  ): ChampionStatsModel[][] {

    // <<roleId, champId>, count>
    const championsPickedTeam = new Map<number, number>();
    const championsBannedByTeam = new Map<number, number>();
    const championsBannedAgainstTeam = new Map<number, number>();
    const championsTeamLostTo = new Map<number, number>();

    gamesList.forEach(gameEntity => {
      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;
      const enemyTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId !== id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;
      const isWinner: boolean =
        (gameEntity.winnerTeamSide == GameTeamSide.Red && gameEntity.redTeamId === id) ||
        (gameEntity.winnerTeamSide == GameTeamSide.Blue && gameEntity.blueTeamId === id)

      myTeam.players.forEach(player => {
        const key = player.championId;
        const val = championsPickedTeam.get(key);
        if (val === undefined) {
          championsPickedTeam.set(key, 1);
        } else {
          championsPickedTeam.set(key, val + 1);
        }
      });

      if (myTeam.bannedChampionIds != undefined) {
        myTeam.bannedChampionIds.forEach(championId => {
          const val = championsBannedByTeam.get(championId);
          if (val === undefined) {
            championsBannedByTeam.set(championId, 1);
          } else {
            championsBannedByTeam.set(championId, val + 1);
          }
        });
      }

      if (enemyTeam.bannedChampionIds != undefined) {
        enemyTeam.bannedChampionIds.forEach(championId => {
          const val = championsBannedAgainstTeam.get(championId);
          if (val === undefined) {
            championsBannedAgainstTeam.set(championId, 1);
          } else {
            championsBannedAgainstTeam.set(championId, val + 1);
          }
        });
      }

      if (!isWinner) {
        enemyTeam.players.forEach(player => {
          const key = player.championId;
          const val = championsTeamLostTo.get(key);
          if (val === undefined) {
            championsTeamLostTo.set(key, 1);
          } else {
            championsTeamLostTo.set(key, val + 1);
          }
        });
      }
    });

    championsPickedTeam[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };
    championsBannedByTeam[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };
    championsBannedAgainstTeam[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };
    championsTeamLostTo[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };

    const mostPickedChampions = [];
    for (const [key, value] of championsPickedTeam) {
      if (mostPickedChampions.length < 5) {
        mostPickedChampions.push(new ChampionStatsModel({
          championId: key,
          percent: 100 * value / gamesList.length,
        }));
      } else {
        break;
      }
    }

    const mostBannedChampionsByTeam = [];
    for (const [key, value] of championsBannedByTeam) {
      if (mostBannedChampionsByTeam.length < 5) {
        mostBannedChampionsByTeam.push(new ChampionStatsModel({
          championId: key,
          percent: 100 * value / gamesList.length,
        }));
      } else {
        break;
      }
    }

    const mostBannedChampionsAgainstToTeam = [];
    for (const [key, value] of championsBannedAgainstTeam) {
      if (mostBannedChampionsAgainstToTeam.length < 5) {
        mostBannedChampionsAgainstToTeam.push(new ChampionStatsModel({
          championId: key,
          percent: 100 * value / gamesList.length,
        }));
      } else {
        break;
      }
    }

    const toughestChampionsToTeam = [];
    for (const [key, value] of championsTeamLostTo) {
      if (toughestChampionsToTeam.length < 5) {
        toughestChampionsToTeam.push(new ChampionStatsModel({
          championId: key,
          percent: 100 * value / gamesList.length,
        }));
      } else {
        break;
      }
    }

    return [mostPickedChampions,
      mostBannedChampionsByTeam,
      mostBannedChampionsAgainstToTeam,
      toughestChampionsToTeam,
    ];
  }

  static keyFromRoles(roles: number[]): number {

    let key = 0;

    for (let index = 0; index < roles.length; index++) {
      key = key * 10 + roles[index];
    }
    return key;
  }

  static rolesFromKey(key: number): PlayerRole[] {
    const roles: PlayerRole[] = [];
    for (let index = 0; index < 5; index++) {
      roles.push(parseInt(key.toString().charAt(index)));
    }
    return roles;
  }

  /*
  Aggregate picking orders
  * @param id The ID of the team
  * @param gamesList The games that the team had played in
  */
  static calculateTopRolePickingFor(
    id: number,
    gamesList: GameEntity[]
  ): MostPickedRolesByOrderModel[] {

    const allOrders = new Map<number, number>();

    gamesList.forEach(gameEntity => {
      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      const orders = myTeam.pickedRolesByOrder;
      if (orders !== undefined) {
        const key: number = this.keyFromRoles(orders);
        const val = allOrders.get(key);
        if (val === undefined) {
          allOrders.set(key, 1);
        } else {
          allOrders.set(key, val + 1);
        }
      }
    });

    allOrders[Symbol.iterator] = function* () {
      yield* [...this.entries()].sort((a, b) => b[1] - a[1]);
    };

    const topOrders: MostPickedRolesByOrderModel[] = [];
    for (const [key, value] of allOrders) {
        const order = new MostPickedRolesByOrderModel();
        order.roleOrder = this.rolesFromKey(key);
        order.percent = 100 * value / gamesList.length;
        topOrders.push(order);
    }

    return topOrders;
  }

  static calculateFirstDragonObjectiveStats(
    id: number,
    gamesList: GameEntity[]
  ): DragonKillInfoModel {

    const resultInfo = new DragonKillInfoModel();
    resultInfo.init();

    gamesList.forEach(gameEntity => {
      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      const firstDragon = myTeam.stats != undefined ? myTeam.stats.objectives.firstDragon : undefined;
      if (firstDragon != undefined) {
        resultInfo.firstDragon.successPercent += firstDragon.isSuccess ? 1 : 0;
        resultInfo.firstDragon.averageTime += firstDragon.time;
      }

      const firstHerald = myTeam.stats != undefined ? myTeam.stats.objectives.firstHerald : undefined;
      if (firstHerald != undefined) {
        resultInfo.firstHerald.successPercent += firstHerald.isSuccess ? 1 : 0;
        resultInfo.firstHerald.averageTime += firstHerald.time;
      }

      const firstBaron = myTeam.stats != undefined ? myTeam.stats.objectives.firstBaron : undefined;
      if (firstBaron != undefined) {
        resultInfo.firstBaron.successPercent += firstBaron.isSuccess ? 1 : 0;
        resultInfo.firstBaron.averageTime += firstBaron.time;
      }
    });

    if (resultInfo.firstDragon != undefined) {
      resultInfo.firstDragon.averageTime /= resultInfo.firstDragon.successPercent; // used percent value as taken count
      resultInfo.firstDragon.successPercent = Math.round(100 * resultInfo.firstDragon.successPercent / gamesList.length);

      resultInfo.firstHerald.averageTime /= resultInfo.firstHerald.successPercent; // used percent value as taken count
      resultInfo.firstHerald.successPercent = Math.round(100 * resultInfo.firstHerald.successPercent / gamesList.length);

      resultInfo.firstBaron.averageTime /= resultInfo.firstBaron.successPercent; // used percent value as taken count
      resultInfo.firstBaron.successPercent = Math.round(100 * resultInfo.firstBaron.successPercent / gamesList.length);
    }

    return resultInfo;
  }

  static calculateDragonSouls(
    id: number,
    gamesList: GameEntity[]
  ): ElementalDragonsInfoModel {

    const dragonInfo = new ElementalDragonsInfoModel();
    dragonInfo.init();

    var numberofCloudDragonSecured = 0;
    var numberofOceanDragonSecured = 0;
    var numberofInfernalDragonSecured = 0;
    var numberofMountainDragonSecured = 0;

    gamesList.forEach(gameEntity => {
      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      const isWinner: boolean =
        (gameEntity.winnerTeamSide == GameTeamSide.Red && gameEntity.redTeamId === id) ||
        (gameEntity.winnerTeamSide == GameTeamSide.Blue && gameEntity.blueTeamId === id)

      if (myTeam.stats != undefined && myTeam.stats.objectives.dragons != undefined) {
        const cloudDragon = myTeam.stats.objectives.dragons.cloudDragon;
        const oceanDragon = myTeam.stats.objectives.dragons.oceanDragon;
        const infernalDragon = myTeam.stats.objectives.dragons.infernalDragon;
        const mountainDragon = myTeam.stats.objectives.dragons.mountainDragon;

        if (cloudDragon != undefined) {
          dragonInfo.cloudDragonInfo.totalDragonCount += cloudDragon.totalCount;
          dragonInfo.cloudDragonInfo.totalKilledDragonCount += cloudDragon.killedCount;
          dragonInfo.cloudDragonInfo.winPercent += isWinner && cloudDragon.killedCount > 0 ? 1 : 0;
          numberofCloudDragonSecured += cloudDragon.killedCount > 0 ? 1 : 0;
        }

        if (oceanDragon != undefined) {
          dragonInfo.oceanDragonInfo.totalDragonCount += oceanDragon.totalCount;
          dragonInfo.oceanDragonInfo.totalKilledDragonCount += oceanDragon.killedCount;
          dragonInfo.oceanDragonInfo.winPercent += isWinner && oceanDragon.killedCount > 0 ? 1 : 0;
          numberofOceanDragonSecured += oceanDragon.killedCount > 0 ? 1 : 0;
        }

        if (infernalDragon != undefined) {
          dragonInfo.infernalDragonInfo.totalDragonCount += infernalDragon.totalCount;
          dragonInfo.infernalDragonInfo.totalKilledDragonCount += infernalDragon.killedCount;
          dragonInfo.infernalDragonInfo.winPercent += isWinner && infernalDragon.killedCount > 0 ? 1 : 0;
          numberofInfernalDragonSecured += infernalDragon.killedCount > 0 ? 1 : 0;
        }

        if (mountainDragon != undefined) {
          dragonInfo.mountainDragonInfo.totalDragonCount += mountainDragon.totalCount;
          dragonInfo.mountainDragonInfo.totalKilledDragonCount += mountainDragon.killedCount;
          dragonInfo.mountainDragonInfo.winPercent += isWinner && mountainDragon.killedCount > 0 ? 1 : 0;
          numberofMountainDragonSecured += mountainDragon.killedCount > 0 ? 1 : 0;
        }
      }
    });

    dragonInfo.cloudDragonInfo.securePercent =
      Math.round(100 * dragonInfo.cloudDragonInfo.totalKilledDragonCount / dragonInfo.cloudDragonInfo.totalDragonCount);
    dragonInfo.oceanDragonInfo.securePercent =
      Math.round(100 * dragonInfo.oceanDragonInfo.totalKilledDragonCount / dragonInfo.oceanDragonInfo.totalDragonCount);
    dragonInfo.infernalDragonInfo.securePercent =
      Math.round(100 * dragonInfo.infernalDragonInfo.totalKilledDragonCount / dragonInfo.infernalDragonInfo.totalDragonCount);
    dragonInfo.mountainDragonInfo.securePercent =
      Math.round(100 * dragonInfo.mountainDragonInfo.totalKilledDragonCount / dragonInfo.mountainDragonInfo.totalDragonCount);

    dragonInfo.cloudDragonInfo.winPercent = Math.round(100 * dragonInfo.cloudDragonInfo.winPercent / numberofCloudDragonSecured);
    dragonInfo.oceanDragonInfo.winPercent = Math.round(100 * dragonInfo.oceanDragonInfo.winPercent / numberofOceanDragonSecured);
    dragonInfo.infernalDragonInfo.winPercent = Math.round(100 * dragonInfo.infernalDragonInfo.winPercent / numberofInfernalDragonSecured);
    dragonInfo.mountainDragonInfo.winPercent = Math.round(100 * dragonInfo.mountainDragonInfo.winPercent / numberofMountainDragonSecured);

    return dragonInfo;
  }

  static calculateLaneInteraction(
    id: number,
    gamesList: GameEntity[]
  ): LaneInteractionInfoModel {

    const topGankInfo = new GankInfoModel(0, 0);
    const middleGankInfo = new GankInfoModel(0, 0);
    const bottomGankInfo = new GankInfoModel(0, 0);

    gamesList.forEach(gameEntity => {

      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      if (myTeam.stats && myTeam.stats.laneInteraction) {
        const lane = myTeam.stats.laneInteraction;

        topGankInfo.successCount += lane.topGankInfo ? lane.topGankInfo.successCount : 0;
        topGankInfo.totalCount += lane.topGankInfo ? lane.topGankInfo.totalCount : 0;

        middleGankInfo.successCount += lane.middleGankInfo ? lane.middleGankInfo.successCount : 0;
        middleGankInfo.totalCount += lane.middleGankInfo ? lane.middleGankInfo.totalCount : 0;

        bottomGankInfo.successCount += lane.bottomGankInfo ? lane.bottomGankInfo.successCount : 0;
        bottomGankInfo.totalCount += lane.bottomGankInfo ? lane.bottomGankInfo.totalCount : 0;
      }
    });

    return new LaneInteractionInfoModel({
      topGankInfo,
      middleGankInfo,
      bottomGankInfo,
    });
  }

  static calculateTurretPlatesTakenInfo(
    id: number,
    gamesList: GameEntity[]
  ): TurretPlatesTakenResponseInfoModel {

    const allRoles = [PlayerRole.Top,
    PlayerRole.Middle,
    PlayerRole.Bottom,
    PlayerRole.Jungler,
    PlayerRole.Support,
    ];

    let topTotal = 0;
    const topTurretDamageInfo: TurretPlateTakenByRoleResponseModel[] = [];
    allRoles.forEach(role => {
      topTurretDamageInfo.push(new TurretPlateTakenByRoleResponseModel({
        roleId: role,
        percent: 0,
      }));
    });

    let middleTotal = 0;
    const middleTurretDamageInfo: TurretPlateTakenByRoleResponseModel[] = [];
    allRoles.forEach(role => {
      middleTurretDamageInfo.push(new TurretPlateTakenByRoleResponseModel({
        roleId: role,
        percent: 0,
      }));
    });

    let bottomTotal = 0;
    const botTurretDamageInfo: TurretPlateTakenByRoleResponseModel[] = [];
    allRoles.forEach(role => {
      botTurretDamageInfo.push(new TurretPlateTakenByRoleResponseModel({
        roleId: role,
        percent: 0,
      }));
    });

    gamesList.forEach(gameEntity => {

      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      if (myTeam.stats && myTeam.stats.towerPlates) {
        const topValues = [myTeam.stats.towerPlates.topTurret ? myTeam.stats.towerPlates.topTurret.topRoleTaken : undefined,
        myTeam.stats.towerPlates.topTurret ? myTeam.stats.towerPlates.topTurret.middleRoleTaken : undefined,
        myTeam.stats.towerPlates.topTurret ? myTeam.stats.towerPlates.topTurret.bottomRoleTaken : undefined,
        myTeam.stats.towerPlates.topTurret ? myTeam.stats.towerPlates.topTurret.junglerRoleTaken : undefined,
        myTeam.stats.towerPlates.topTurret ? myTeam.stats.towerPlates.topTurret.supportRoleTaken : undefined]

        allRoles.forEach(role => {
          const t = topTurretDamageInfo.find(t => t.roleId == role);
          const val = topValues[role - 1];
          if (t && val) {
            t.percent += val / gamesList.length;
            topTotal += val / gamesList.length;
          }
        });

        const midValues = [myTeam.stats.towerPlates.middleTurret ? myTeam.stats.towerPlates.middleTurret.topRoleTaken : undefined,
        myTeam.stats.towerPlates.middleTurret ? myTeam.stats.towerPlates.middleTurret.middleRoleTaken : undefined,
        myTeam.stats.towerPlates.middleTurret ? myTeam.stats.towerPlates.middleTurret.bottomRoleTaken : undefined,
        myTeam.stats.towerPlates.middleTurret ? myTeam.stats.towerPlates.middleTurret.junglerRoleTaken : undefined,
        myTeam.stats.towerPlates.middleTurret ? myTeam.stats.towerPlates.middleTurret.supportRoleTaken : undefined]

        allRoles.forEach(role => {
          const t = middleTurretDamageInfo.find(t => t.roleId == role);
          const val = midValues[role - 1];

          if (t && val) {
            t.percent += val / gamesList.length;
            middleTotal += val / gamesList.length;
          }
        });

        const botValues = [myTeam.stats.towerPlates.bottomTurret ? myTeam.stats.towerPlates.bottomTurret.topRoleTaken : undefined,
        myTeam.stats.towerPlates.bottomTurret ? myTeam.stats.towerPlates.bottomTurret.middleRoleTaken : undefined,
        myTeam.stats.towerPlates.bottomTurret ? myTeam.stats.towerPlates.bottomTurret.bottomRoleTaken : undefined,
        myTeam.stats.towerPlates.bottomTurret ? myTeam.stats.towerPlates.bottomTurret.junglerRoleTaken : undefined,
        myTeam.stats.towerPlates.bottomTurret ? myTeam.stats.towerPlates.bottomTurret.supportRoleTaken : undefined]

        allRoles.forEach(role => {
          const t = botTurretDamageInfo.find(t => t.roleId == role);
          const val = botValues[role - 1];
          if (t && val) {
            t.percent += val / gamesList.length;
            bottomTotal += val / gamesList.length;
          }
        });
      }
    });

    allRoles.forEach(role => {
      const playerAtTopTurret = topTurretDamageInfo.find(t => t.roleId == role);
      if (playerAtTopTurret) {
        playerAtTopTurret.percent = Math.round(100 * playerAtTopTurret.percent / topTotal);
      }

      const playerAtMidTurret = middleTurretDamageInfo.find(t => t.roleId == role);
      if (playerAtMidTurret) {
        playerAtMidTurret.percent = Math.round(100 * playerAtMidTurret.percent / middleTotal);
      }

      const playerAtBotTurret = botTurretDamageInfo.find(t => t.roleId == role);
      if (playerAtBotTurret) {
        playerAtBotTurret.percent = Math.round(100 * playerAtBotTurret.percent / bottomTotal);
      }
    });

    const turrentPlateInfo = new TurretPlatesTakenResponseInfoModel({
      topTurretDamageInfo: topTurretDamageInfo,
      topTurretPlates: topTotal,
      middleTurretDamageInfo: middleTurretDamageInfo,
      middleTurretPlates: middleTotal,
      bottomTurretDamageInfo: middleTurretDamageInfo,
      bottomTurretPlates: bottomTotal,
    });
    return turrentPlateInfo;
  }

  static calculateLaningInfo(
    id: number,
    gamesList: GameEntity[]
  ): LaningInfoModel {

    const csDiffAt10 = new LaningBasicInfoModel({
      topInfo: 0,
      jngInfo: 0,
      midInfo: 0,
      bottomInfo: 0,
      supportInfo: 0,
    });

    const csDiffAt20 = new LaningBasicInfoModel({
      topInfo: 0,
      jngInfo: 0,
      midInfo: 0,
      bottomInfo: 0,
      supportInfo: 0,
    });

    const averageControlWardAt10 = new LaningBasicInfoModel;
    const averageControlWardAt15 = new LaningBasicInfoModel;
    const averageControlWardAt20 = new LaningBasicInfoModel;
    const averageControlWardAt30 = new LaningBasicInfoModel;
    const averageIsolatedDeaths = new LaningBasicInfoModel;

    gamesList.forEach(gameEntity => {

      const myTeam: GameUploadTeamInfoModel =
        gameEntity.redTeamId === id ?
          gameEntity.redTeamInfo : gameEntity.blueTeamInfo;

      myTeam.players.forEach(p => {
        switch (p.role) {
          case PlayerRole.Top:
            if (p.stats && p.stats.top && p.stats.top.laning) {
              const csDiffVal = p.stats.top.laning.avgCreepScoreDifferenceCount;
              if (csDiffVal) {
                csDiffAt10.topInfo += csDiffVal.min10 / gamesList.length;
                if (csDiffVal.min20) {
                  csDiffAt20.topInfo += csDiffVal.min20 / gamesList.length;
                }
              }

              const isolatedDeath = p.stats.top.general ? p.stats.top.general.avgIsolatedDeathCount ? p.stats.top.general.avgIsolatedDeathCount.total : undefined : undefined;
              if (isolatedDeath) {
                averageIsolatedDeaths.topInfo += isolatedDeath / gamesList.length;
              }
            }

            if (p.stats && p.stats.top && p.stats.top.vision) {

              averageControlWardAt10.topInfo += p.stats.top.vision.avgControlWardsBoughtCount.min10 / gamesList.length;
              averageControlWardAt15.topInfo += p.stats.top.vision.avgControlWardsBoughtCount.min15 / gamesList.length;
              averageControlWardAt20.topInfo += (p.stats.top.vision.avgControlWardsBoughtCount.min20 ?? 0) / gamesList.length;
              averageControlWardAt30.topInfo += (p.stats.top.vision.avgControlWardsBoughtCount.min30 ?? 0) / gamesList.length;
            }

            break;
          case PlayerRole.Middle:
            if (p.stats && p.stats.middle && p.stats.middle.laning) {
              const v = p.stats.middle.laning.avgCreepScoreDifferenceCount;
              if (v) {
                csDiffAt10.midInfo += v.min10 / gamesList.length;
                if (v.min20) {
                  csDiffAt20.midInfo += v.min20 / gamesList.length;
                }
              }

              const isolatedDeath = p.stats.middle.general ? p.stats.middle.general.avgIsolatedDeathCount ? p.stats.middle.general.avgIsolatedDeathCount.total : undefined : undefined;
              if (isolatedDeath) {
                averageIsolatedDeaths.midInfo += isolatedDeath / gamesList.length;
              }

            }

            if (p.stats && p.stats.middle && p.stats.middle.vision) {

              averageControlWardAt10.midInfo += p.stats.middle.vision.avgControlWardsBoughtCount.min10 / gamesList.length;
              averageControlWardAt15.midInfo += p.stats.middle.vision.avgControlWardsBoughtCount.min15 / gamesList.length;
              averageControlWardAt20.midInfo += (p.stats.middle.vision.avgControlWardsBoughtCount.min20 ?? 0) / gamesList.length;
              averageControlWardAt30.midInfo += (p.stats.middle.vision.avgControlWardsBoughtCount.min30 ?? 0) / gamesList.length;
            }

            break;
          case PlayerRole.Bottom:
            if (p.stats && p.stats.bottom && p.stats.bottom.laning) {
              const v = p.stats.bottom.laning.avgCreepScoreDifferenceCount;
              if (v) {
                csDiffAt10.bottomInfo += v.min10 / gamesList.length;
                if (v.min20) {
                  csDiffAt20.bottomInfo += v.min20 / gamesList.length;
                }

                const isolatedDeath = p.stats.bottom.general ? p.stats.bottom.general.avgIsolatedDeathCount ? p.stats.bottom.general.avgIsolatedDeathCount.total : undefined : undefined;
                if (isolatedDeath) {
                  averageIsolatedDeaths.bottomInfo += isolatedDeath / gamesList.length;
                }
              }
            }

            if (p.stats && p.stats.bottom && p.stats.bottom.vision) {

              averageControlWardAt10.bottomInfo += p.stats.bottom.vision.avgControlWardsBoughtCount.min10 / gamesList.length;
              averageControlWardAt15.bottomInfo += p.stats.bottom.vision.avgControlWardsBoughtCount.min15 / gamesList.length;
              averageControlWardAt20.bottomInfo += (p.stats.bottom.vision.avgControlWardsBoughtCount.min20 ?? 0) / gamesList.length;
              averageControlWardAt30.bottomInfo += (p.stats.bottom.vision.avgControlWardsBoughtCount.min30 ?? 0) / gamesList.length;
            }

            break;
          case PlayerRole.Jungler:
            if (p.stats && p.stats.jungler && p.stats.jungler.laning) {
              const v = p.stats.jungler.laning.avgCreepScoreDifferenceCount;
              if (v) {
                csDiffAt10.jngInfo += v.min10 / gamesList.length;
                if (v.min20) {
                  csDiffAt20.jngInfo += v.min20 / gamesList.length;
                }

                const isolatedDeath = p.stats.jungler.general ? p.stats.jungler.general.avgIsolatedDeathCount ? p.stats.jungler.general.avgIsolatedDeathCount.total : undefined : undefined;
                if (isolatedDeath) {
                  averageIsolatedDeaths.jngInfo += isolatedDeath / gamesList.length;
                }
              }
            }


            if (p.stats && p.stats.jungler && p.stats.jungler.avgControlWardsBoughtCount) {

              averageControlWardAt10.jngInfo += p.stats.jungler.avgControlWardsBoughtCount.min10 / gamesList.length;
              averageControlWardAt15.jngInfo += p.stats.jungler.avgControlWardsBoughtCount.min15 / gamesList.length;
              averageControlWardAt20.jngInfo += (p.stats.jungler.avgControlWardsBoughtCount.min20 ?? 0) / gamesList.length;
              averageControlWardAt30.jngInfo += (p.stats.jungler.avgControlWardsBoughtCount.min30 ?? 0) / gamesList.length;
            }

            break;
          case PlayerRole.Support:
            if (p.stats && p.stats.support && p.stats.support.laning) {
              const v = p.stats.support.laning.avgCreepScoreDifferenceCount;
              if (v) {
                csDiffAt10.supportInfo += v.min10 / gamesList.length;
                if (v.min20) {
                  csDiffAt20.supportInfo += v.min20 / gamesList.length;
                }

                const isolatedDeath = p.stats.support.general ? p.stats.support.general.avgIsolatedDeathCount ? p.stats.support.general.avgIsolatedDeathCount.total : undefined : undefined;
                if (isolatedDeath) {
                  averageIsolatedDeaths.supportInfo += isolatedDeath / gamesList.length;
                }
              }
            }

            if (p.stats && p.stats.support && p.stats.support.vision) {

              averageControlWardAt10.supportInfo += p.stats.support.vision.avgControlWardsPerMinCount.min10 / gamesList.length;
              averageControlWardAt15.supportInfo += p.stats.support.vision.avgControlWardsPerMinCount.min15 / gamesList.length;
              averageControlWardAt20.supportInfo += (p.stats.support.vision.avgControlWardsPerMinCount.min20 ?? 0) / gamesList.length;
              averageControlWardAt30.supportInfo += (p.stats.support.vision.avgControlWardsPerMinCount.min30 ?? 0) / gamesList.length;
            }

            break;

          default:
            break;
        }

      });
    });

    return new LaningInfoModel({
      averageIsolatedDeaths,
      averageControlWardAt10,
      averageControlWardAt15,
      averageControlWardAt20,
      averageControlWardAt30,
      CSDifferenceAt10: csDiffAt10,
      CSDifferenceAt20: csDiffAt20,
    });
  }

  /**
   * Aggregate the team stats
   * @param id The ID of the team
   * @param gamesList The games that the team had played in
   */
  static aggregateTeamStats(
    id: number,
    gamesList: GameEntity[],
  ): TeamOverallStatsModel {

    const [blindPicks, counterPicks] = this.calculatePicksFor(id, gamesList);
    const [mostPickedChampionStats,
      mostBannedByChampionStats,
      mostBannedAgainstChampionStats,
      loseToChampionStats,
    ] = this.calculateChampionsStatsFor(id, gamesList);
    const mostPickedRolesByOrder = this.calculateTopRolePickingFor(id, gamesList);
    const turretPlatesTakenInfo = this.calculateTurretPlatesTakenInfo(id, gamesList);

    return new TeamOverallStatsModel({
      gameCount: gamesList.length,
      blindPicks,
      counterPicks,
      mostPickedChampionStats,
      mostBannedByChampionStats,
      mostBannedAgainstChampionStats,
      loseToChampionStats,
      mostPickedRolesByOrder,
      firstDragonData: this.calculateFirstDragonObjectiveStats(id, gamesList),
      elementalDragonsInfo: this.calculateDragonSouls(id, gamesList),
      laneInteractionInfo: this.calculateLaneInteraction(id, gamesList),
      averagePlates: turretPlatesTakenInfo.topTurretPlates + turretPlatesTakenInfo.bottomTurretPlates + turretPlatesTakenInfo.middleTurretPlates,
      turretPlatesTakenInfo,
      laningInfo: this.calculateLaningInfo(id, gamesList),
    });
  }
}
