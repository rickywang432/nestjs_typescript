import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, Min, ValidateNested } from 'class-validator';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { PlayerRole } from '../players/player-role.enum';

export class ChampionPickInfoModel {
  /**
   * The ID of the Role.
   */
  @ApiModelProperty({
    description: 'The ID of the Role.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsEnum(PlayerRole)
  roleId: PlayerRole;

  /**
   * Picks count.
   * When used for postmatch uploading, it will be 1 or 0
   * When used for response model of team-stats-aggregation, it will be total count
   */
  @ApiModelProperty({
    description: 'Number of Picks',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsInt()
  @Min(0)
  picksCount: number;

  constructor(data?: { roleId: PlayerRole; picksCount: number }) {
    if (data != undefined) {
      this.roleId = data.roleId;
      this.picksCount = data.picksCount;
    }
  }
}

export class ChampionStatsModel {
  /**
   * The ID of the champion.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The ID of the champion.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  championId: number;

  /**
   * Percent.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Percent of champions pick, banned or lose',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  percent: number;

  constructor(data?: {championId: number; percent: number }) {
    if (data != undefined) {
      this.championId = data.championId;
      this.percent = data.percent;
    }
  }
}

export class MostPickedRolesByOrderModel {
  /**
   * Role Picking Order.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Role Picking Order.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  roleOrder: PlayerRole[];

  /**
   * Percent.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Percent of order',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  percent: number;

  constructor(data?: { roleOrder: PlayerRole[]; percent: number }) {
    if (data != undefined) {
      this.roleOrder = data.roleOrder;
      this.percent = data.percent;
    }
  }
}

export class DragonKillBasicInfoModel {
  /**
   * Success Percent
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Success Percent',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  successPercent: number;

  /**
   * Average time killed Dragon
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Success Percent',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  averageTime: number;

  constructor(data?: { successPercent: number; averageTime: number }) {
    if (data != undefined) {
      this.successPercent = data.successPercent;
      this.averageTime = data.averageTime;
    } else {
      this.successPercent = 0;
      this.averageTime = 0;
    }
  }
}

export class DragonKillInfoModel {
  /**
   * First Dragon Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'First Dragon Information',
    type: DragonKillBasicInfoModel,
  })
  @Type(() => DragonKillBasicInfoModel)
  firstDragon: DragonKillBasicInfoModel;

  /**
   * First Herald Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'First Herald Information',
    type: DragonKillBasicInfoModel,
  })
  @Type(() => DragonKillBasicInfoModel)
  firstHerald: DragonKillBasicInfoModel;

  /**
   * First Baron Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'First Baron Information',
    type: DragonKillBasicInfoModel,
  })
  @Type(() => DragonKillBasicInfoModel)
  firstBaron: DragonKillBasicInfoModel;

  constructor(data?: {
    firstDragon: DragonKillBasicInfoModel;
    firstHerald: DragonKillBasicInfoModel;
    firstBaron: DragonKillBasicInfoModel;
  }) {
    if (data != undefined) {
      this.firstDragon = data.firstDragon;
      this.firstHerald = data.firstHerald;
      this.firstBaron = data.firstBaron;
    }
  }

  init() {
    this.firstBaron = new DragonKillBasicInfoModel;
    this.firstDragon = new DragonKillBasicInfoModel;
    this.firstHerald = new DragonKillBasicInfoModel;
  }
}

export class ElementalDragonsBasicInfoModel {

  /**
   * Total Number of Existing Dragons
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Total Number of Existing Dragons',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  totalDragonCount: number;

  /**
   * Total Number of Killed Dragons
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Total Number of Killed Dragons',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  totalKilledDragonCount: number;

  /**
   * Secure Percent
   */
  @ApiModelProperty({
    readOnly: true,
    description: ' Secure Percent',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  securePercent: number;

  /**
   * Win Percent
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Win Percent',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  winPercent: number;

  constructor(data?: {
    dragonName: string;
    totalDragonCount: number;
    totalKilledDragonCount: number;
    securePercent: number;
    winPercent: number;
  }) {
    if (data != undefined) {
      this.totalDragonCount = data.totalDragonCount;
      this.totalKilledDragonCount = data.totalKilledDragonCount;
      this.securePercent = data.securePercent;
      this.winPercent = data.winPercent;
    } else {
      this.totalDragonCount = 0;
      this.totalKilledDragonCount = 0;
      this.securePercent = 0;
      this.winPercent = 0;
    }
  }
}

export class ElementalDragonsInfoModel {
  /**
   * Cloud Dragon Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Cloud Dragon Information',
    type: ElementalDragonsBasicInfoModel,
  })
  @Type(() => ElementalDragonsBasicInfoModel)
  cloudDragonInfo: ElementalDragonsBasicInfoModel;

  /**
   * Infernal Dragon Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Infernal Dragon Information',
    type: ElementalDragonsBasicInfoModel,
  })
  @Type(() => ElementalDragonsBasicInfoModel)
  infernalDragonInfo: ElementalDragonsBasicInfoModel;

  /**
   * Mountain Dragon Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Mountain Dragon Information',
    type: ElementalDragonsBasicInfoModel,
  })
  @Type(() => ElementalDragonsBasicInfoModel)
  mountainDragonInfo: ElementalDragonsBasicInfoModel;

  /**
   * Ocean Dragon Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Ocean Dragon Information',
    type: ElementalDragonsBasicInfoModel,
  })
  @Type(() => ElementalDragonsBasicInfoModel)
  oceanDragonInfo: ElementalDragonsBasicInfoModel;

  constructor(data?: {
    cloudDragonInfo: ElementalDragonsBasicInfoModel;
    infernalDragonInfo: ElementalDragonsBasicInfoModel;
    mountainDragonInfo: ElementalDragonsBasicInfoModel;
    oceanDragonInfo: ElementalDragonsBasicInfoModel;
  }) {
    if (data != undefined) {
      this.cloudDragonInfo = data.cloudDragonInfo;
      this.infernalDragonInfo = data.infernalDragonInfo;
      this.mountainDragonInfo = data.mountainDragonInfo;
      this.oceanDragonInfo = data.oceanDragonInfo;
    }
  }

  init() {
    this.cloudDragonInfo = new ElementalDragonsBasicInfoModel;
    this.oceanDragonInfo = new ElementalDragonsBasicInfoModel;
    this.infernalDragonInfo = new ElementalDragonsBasicInfoModel;
    this.mountainDragonInfo = new ElementalDragonsBasicInfoModel;
  }
}

export class GankInfoModel {

  /**
   * Total Gank count.
   */
  @ApiModelProperty({
    description: 'Total Gank Count',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsInt()
  @Min(0)
  totalCount: number;

  /**
   * Success count.
   */
  @ApiModelProperty({
    description: 'Number of Gank Success',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsInt()
  @Min(0)
  successCount: number;

  constructor(total:number, success:number) {
    this.totalCount = total;
    this.successCount = success;
  }
}

export class LaneInteractionInfoModel {
  /**
   * Top Gank Total/Success
   */
  @ApiModelProperty({
    description: 'Top Gank Total/Success',
    type: GankInfoModel,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GankInfoModel)
  topGankInfo: GankInfoModel;

  /**
   * Middle Gank Percent
   */
  @ApiModelProperty({
    description: 'Middle Gank Total/Success',
    type: GankInfoModel,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GankInfoModel)
  middleGankInfo: GankInfoModel;

  /**
   * Bottom Gank Total/Success
   */
  @ApiModelProperty({
    description: 'Bottom Gank Total/Success',
    type: GankInfoModel,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GankInfoModel)
  bottomGankInfo: GankInfoModel;

  constructor(data?: {
    topGankInfo: GankInfoModel;
    middleGankInfo: GankInfoModel;
    bottomGankInfo: GankInfoModel;
  }) {
    if (data != undefined) {
      this.topGankInfo = data.topGankInfo;
      this.middleGankInfo = data.middleGankInfo;
      this.bottomGankInfo = data.bottomGankInfo;
    } else {
      if (this.topGankInfo != undefined) {
        this.topGankInfo.successCount = 0;
        this.topGankInfo.totalCount = 0;
      }
      if (this.middleGankInfo != undefined) {
        this.middleGankInfo.successCount = 0;
        this.middleGankInfo.totalCount = 0;
      }
      if (this.bottomGankInfo != undefined) {
        this.bottomGankInfo.successCount = 0;
        this.bottomGankInfo.totalCount = 0;
      }
    }
  }

  init() {

    this.topGankInfo = new GankInfoModel(0, 0);
    this.middleGankInfo = new GankInfoModel(0, 0);
    this.bottomGankInfo = new GankInfoModel(0, 0);
  }
}

export class TurretPlateTakenByRoleResponseModel {
  /**
   * The ID of the role.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The ID of the role.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  roleId: PlayerRole;

  /**
   * Turret Taken Percent in Team
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Turret Plate Taken Percent in Team',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  percent: number;

  constructor(data?: { roleId: PlayerRole; percent: number }) {
    if (data != undefined) {
      this.roleId = data.roleId;
      this.percent = data.percent;
    }
  }
}

export class TurretPlatesTakenResponseInfoModel {

  /**
   * Top Turret Damage Taken Info
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Top Turret.',
    type: TurretPlateTakenByRoleResponseModel,
  })
  topTurretDamageInfo: TurretPlateTakenByRoleResponseModel[];

  /**
   * Top Turret plates taken
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Top Turret Plates Taken.',
    type: TurretPlateTakenByRoleResponseModel,
  })
  topTurretPlates: number;

  /**
   * Middle Turret Damage Taken Info
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Middle Turret.',
    type: TurretPlateTakenByRoleResponseModel,
  })
  middleTurretDamageInfo: TurretPlateTakenByRoleResponseModel[];

  /**
   * Mid Turret plates taken
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Top Turret Plates Taken.',
    type: TurretPlateTakenByRoleResponseModel,
  })
  middleTurretPlates: number;

  /**
   * Bottom Turret Damage Taken Info
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Bottom Turret.',
    type: TurretPlateTakenByRoleResponseModel,
  })
  bottomTurretDamageInfo: TurretPlateTakenByRoleResponseModel[];

  /**
   * Bot Turret plates taken
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Top Turret Plates Taken.',
    type: TurretPlateTakenByRoleResponseModel,
  })
  bottomTurretPlates: number;

  constructor(data?: {
    topTurretDamageInfo: TurretPlateTakenByRoleResponseModel[];
    topTurretPlates: number;
    middleTurretDamageInfo: TurretPlateTakenByRoleResponseModel[];
    middleTurretPlates: number;
    bottomTurretDamageInfo: TurretPlateTakenByRoleResponseModel[];
    bottomTurretPlates: number;
  }) {
    if (data != undefined) {
      this.topTurretDamageInfo = data.topTurretDamageInfo;
      this.middleTurretDamageInfo = data.middleTurretDamageInfo;
      this.bottomTurretDamageInfo = data.bottomTurretDamageInfo;

      this.topTurretPlates = data.topTurretPlates;
      this.middleTurretPlates = data.middleTurretPlates;
      this.bottomTurretPlates = data.bottomTurretPlates;
    }
  }
}

export class LaningBasicInfoModel {
  /**
   * Information of the top.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information of the top.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  topInfo: number;

  /**
   * Information of the jungle.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information of the jungle.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  jngInfo: number;

  /**
   * Information of the middle.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information of the middle.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  midInfo: number;

  /**
   * Information of the bottom.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information of the bottom.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  bottomInfo: number;

  /**
   * Information of the support.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information of the support.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  supportInfo: number;

  constructor(data?: {
    topInfo: number;
    jngInfo: number;
    midInfo: number;
    bottomInfo: number;
    supportInfo: number;
  }) {
    if (data != undefined) {
      this.topInfo = data.topInfo;
      this.jngInfo = data.jngInfo;
      this.midInfo = data.midInfo;
      this.bottomInfo = data.bottomInfo;
      this.supportInfo = data.supportInfo;
    } else {
      this.topInfo = 0;
      this.jngInfo = 0;
      this.midInfo = 0;
      this.bottomInfo = 0;
      this.supportInfo = 0;
    }
  }
}

export class LaningInfoModel {

  /**
   *  Average Isolated Deaths
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Isolated Deaths.',
    type: LaningBasicInfoModel,
  })
  averageIsolatedDeaths: LaningBasicInfoModel;

  /**
   *  Average Control Wards @10
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Control Wards @10.',
    type: LaningBasicInfoModel,
  })
  averageControlWardAt10: LaningBasicInfoModel;

  /**
   *  Average Control Wards @15
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Control Wards @15.',
    type: LaningBasicInfoModel,
  })
  averageControlWardAt15: LaningBasicInfoModel;

  /**
   *  Average Control Wards @20
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Control Wards @20.',
    type: LaningBasicInfoModel,
  })
  averageControlWardAt20: LaningBasicInfoModel;

  /**
   *  Average Control Wards @30
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Control Wards @30.',
    type: LaningBasicInfoModel,
  })
  averageControlWardAt30: LaningBasicInfoModel;

  /**
   *  CS difference @10
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'CS difference @10.',
    type: LaningBasicInfoModel,
  })
  CSDifferenceAt10: LaningBasicInfoModel;

  /**
   *  CS difference @20
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'CS difference @20.',
    type: LaningBasicInfoModel,
  })
  CSDifferenceAt20: LaningBasicInfoModel;

  constructor(data?: {
    averageIsolatedDeaths: LaningBasicInfoModel;
    averageControlWardAt10: LaningBasicInfoModel;
    averageControlWardAt15: LaningBasicInfoModel;
    averageControlWardAt20: LaningBasicInfoModel;
    averageControlWardAt30: LaningBasicInfoModel;
    CSDifferenceAt10: LaningBasicInfoModel;
    CSDifferenceAt20: LaningBasicInfoModel;
  }) {
    if (data != undefined) {
      this.averageIsolatedDeaths = data.averageIsolatedDeaths;
      this.averageControlWardAt10 = data.averageControlWardAt10;
      this.averageControlWardAt15 = data.averageControlWardAt15;
      this.averageControlWardAt20 = data.averageControlWardAt20;
      this.averageControlWardAt30 = data.averageControlWardAt30;
      this.CSDifferenceAt10 = data.CSDifferenceAt10;
      this.CSDifferenceAt20 = data.CSDifferenceAt20;
    }
  }
}

export class TeamOverallStatsModel {
  /**
   * The total number of games.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The total number of games.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameCount: number;

  /**
   * The number of Blind Picks each role player selected in the game.
   */
  @ApiModelProperty({
    readOnly: true,
    description:
      'The number of Blind Picks each role player selected in the game.',
    type: ChampionPickInfoModel,
  })
  blindPicks: ChampionPickInfoModel[];

  /**
   * The number of Counter Picks each role player selected in the game.
   */
  @ApiModelProperty({
    readOnly: true,
    description:
      'The number of Counter Picks each role player selected in the game.',
    type: ChampionPickInfoModel,
  })
  counterPicks: ChampionPickInfoModel[];

  /**
   * Most Picked Champion Ids in the games.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Most Picked Champion Ids in the games.',
    type: ChampionStatsModel,
  })
  mostPickedChampionStats: ChampionStatsModel[];

  /**
   * ChampionIds most Banned By this team
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Most Picked Champion Ids.',
    type: ChampionStatsModel,
  })
  mostBannedByChampionStats: ChampionStatsModel[];

  /**
   * ChampionIds most Banned Against this team
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'ChampionIds most Banned Against this team.',
    type: ChampionStatsModel,
  })
  mostBannedAgainstChampionStats: ChampionStatsModel[];

  /**
   * ChampionIds this team lose to.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'ChampionIds this team lose to.',
    type: ChampionStatsModel,
  })
  loseToChampionStats: ChampionStatsModel[];

  /**
   * Most Picked RoleIds By Order.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Most Picked RoleIds By Order.',
    type: MostPickedRolesByOrderModel,
  })
  mostPickedRolesByOrder: MostPickedRolesByOrderModel[];

  /**
   * Success Percent and Avg. time of First Dragon, Herald and Baron Kill
   */
  @ApiModelProperty({
    readOnly: true,
    description:
      'Success Percent and Avg. time of First Dragon, Herald and Baron Kill.',
    type: DragonKillInfoModel,
  })
  firstDragonData: DragonKillInfoModel;

  /**
   * Elemental Dragons Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Elemental Dragons Information.',
    type: ElementalDragonsInfoModel,
  })
  elementalDragonsInfo: ElementalDragonsInfoModel;

  /**
   * Lane Interaction Information.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Lane Interaction Information.',
    type: LaneInteractionInfoModel,
  })
  laneInteractionInfo: LaneInteractionInfoModel;

  /**
   * Average Plate.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Plate.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  averagePlates: number;

  /**
   * Average Number of tower Plates Taken
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Average Number of tower Plates Taken.',
    type: TurretPlatesTakenResponseInfoModel,
  })
  turretPlatesTakenInfo: TurretPlatesTakenResponseInfoModel;

  /**
   * Laning Information
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Laning Information.',
    type: LaningInfoModel,
  })
  laningInfo: LaningInfoModel;

  constructor(data?: {
    gameCount: number;
    blindPicks: ChampionPickInfoModel[];
    counterPicks: ChampionPickInfoModel[];
    mostPickedChampionStats: ChampionStatsModel[];
    mostBannedByChampionStats: ChampionStatsModel[];
    mostBannedAgainstChampionStats: ChampionStatsModel[];
    loseToChampionStats: ChampionStatsModel[];
    mostPickedRolesByOrder: MostPickedRolesByOrderModel[];
    firstDragonData: DragonKillInfoModel;
    elementalDragonsInfo: ElementalDragonsInfoModel;
    laneInteractionInfo: LaneInteractionInfoModel;
    averagePlates: number;
    turretPlatesTakenInfo: TurretPlatesTakenResponseInfoModel;
    laningInfo: LaningInfoModel;
  }) {
    if (data != undefined) {
      this.gameCount = data.gameCount;
      this.blindPicks = data.blindPicks;
      this.counterPicks = data.counterPicks;
      this.mostPickedChampionStats = data.mostPickedChampionStats;
      this.mostBannedByChampionStats = data.mostBannedByChampionStats;
      this.mostBannedAgainstChampionStats = data.mostBannedAgainstChampionStats;
      this.loseToChampionStats = data.loseToChampionStats;
      this.mostPickedRolesByOrder = data.mostPickedRolesByOrder;
      this.firstDragonData = data.firstDragonData;
      this.elementalDragonsInfo = data.elementalDragonsInfo;
      this.laneInteractionInfo = data.laneInteractionInfo;
      this.averagePlates = data.averagePlates;
      this.turretPlatesTakenInfo = data.turretPlatesTakenInfo;
      this.laningInfo = data.laningInfo;
    }
  }
}

export class TeamOverallStatsWithRelationsModel {
  /**
   * The primary overall stats.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The primary overall stats.',
    type: TeamOverallStatsModel,
  })
  primaryOverallStats: TeamOverallStatsModel;

  /**
   * An array of secondary overall stats (for versus team, specific team itself or all teams in a specific region).
   */
  @ApiModelPropertyOptional({
    readOnly: true,
    description:
      'An array of secondary overall stats (for versus team, specific team itself or all teams in a specific region).',
    type: TeamOverallStatsModel,
  })
  secondaryOverallStats?: TeamOverallStatsModel | undefined;

  constructor(data?: {
    primaryOverallStats: TeamOverallStatsModel;
    secondaryOverallStats?: TeamOverallStatsModel;
  }) {
    if (data) {
      this.primaryOverallStats = data.primaryOverallStats;
      if (data.secondaryOverallStats) {
        this.secondaryOverallStats = data.secondaryOverallStats;
      }
    }
  }
}
