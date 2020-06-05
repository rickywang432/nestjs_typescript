import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsObject,
  IsOptional,
  ValidateNested,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { OpenApiType } from '../open-api-type';

/**
 * Contains information about stats at specific periods of the game.
 */
export class PlayerAnyGamePeriodStatsModel {
  /**
   * The value of the stat at the 10 min into the game.
   */
  @ApiModelProperty()
  @IsNumber()
  min10: number;

  /**
   * The value of the stat at the 15 min into the game.
   */
  @ApiModelProperty()
  @IsNumber()
  min15: number;

  /**
   * The value of the stat at the 20 min into the game.
   */
  @ApiModelPropertyOptional({ type: OpenApiType.Number })
  @IsOptional()
  @IsNumber()
  min20?: number | undefined;

  /**
   * The value of the stat at the 30 min into the game.
   */
  @ApiModelPropertyOptional({ type: OpenApiType.Number })
  @IsOptional()
  @IsNumber()
  min30?: number | undefined;

  /**
   * The value of the stat at the 20 min into the game.
   */
  @ApiModelPropertyOptional({ type: OpenApiType.Number })
  @IsOptional()
  @IsNumber()
  total?: number | undefined;
  
  /**
   * Initialization PlayerAnyGamePeriodStatsModel.
   */
  init() {
    this.min10 = 0;
    this.min15 = 0;
    this.min20 = 0;
    this.total = 0;
  }
}

/**
 * Contains information about how many items of a total number of items has been affected.
 */
export class PlayerAnyGamePeriodPortionStatsItemModel {
  /**
   * The number of items affected.
   */
  @ApiModelProperty()
  @IsInt()
  count: number;

  /**
   * The total number of items.
   */
  @ApiModelProperty()
  @IsInt()
  total: number;
    
  /**
   * Initialization PlayerAnyGamePeriodPortionStatsItemModel.
   */
  init() {
    this.count = 0;
    this.total = 0;
  }
}

/**
 * Contains information about stats at specific periods of the game.
 */
export class PlayerAnyGamePeriodPortionStatsModel {
  /**
   * The value of the stat at the 10 min into the game.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodPortionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodPortionStatsItemModel)
  min10: PlayerAnyGamePeriodPortionStatsItemModel;

  /**
   * The value fo the stat at the 15 min into the game.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodPortionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodPortionStatsItemModel)
  min15: PlayerAnyGamePeriodPortionStatsItemModel;
    
  /**
   * Initialization PlayerAnyGamePeriodPortionStatsModel.
   */
  init() {
    this.min10 = new PlayerAnyGamePeriodPortionStatsItemModel;
    this.min15 = new PlayerAnyGamePeriodPortionStatsItemModel;
    this.min10.init();
    this.min15.init();
  }
}

/**
 * Team-fight damage stats.
 */
export class PlayerAnyTeamFightDamageStatsItemModel {
  /**
   * Top.
   */
  @ApiModelProperty()
  @IsNumber()
  topPercent: number;

  /**
   * Jungle.
   */
  @ApiModelProperty()
  @IsNumber()
  junglePercent: number;

  /**
   * Middle.
   */
  @ApiModelProperty()
  @IsNumber()
  middlePercent: number;

  /**
   * Bottom.
   */
  @ApiModelProperty()
  @IsNumber()
  bottomPercent: number;

  /**
   * Support.
   */
  @ApiModelProperty()
  @IsNumber()
  supportPercent: number;
  
  /**
   * Initialization PlayerAnyTeamFightDamageStatsItemModel.
   */
  init() {
    this.topPercent = 0;
    this.junglePercent = 0;
    this.middlePercent = 0;
    this.bottomPercent = 0;
    this.supportPercent = 0;
  }
}

/**
 * Team-fight damage stats.
 */
export class PlayerAnyTeamFightDamageStatsModel {
  /**
   * Avg damage vs ally avg damage.
   */
  @ApiModelProperty({ type: PlayerAnyTeamFightDamageStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyTeamFightDamageStatsItemModel)
  team: PlayerAnyTeamFightDamageStatsItemModel;

  /**
   * Avg damage dealt to enemy.
   */
  @ApiModelProperty({ type: PlayerAnyTeamFightDamageStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyTeamFightDamageStatsItemModel)
  enemy: PlayerAnyTeamFightDamageStatsItemModel;
  
  /**
  * Initialization PlayerAnyTeamFightDamageStatsModel.
  */
  init() {
    this.team = new PlayerAnyTeamFightDamageStatsItemModel;
    this.enemy = new PlayerAnyTeamFightDamageStatsItemModel;
    this.team.init();
    this.enemy.init();
  }
}

/**
 * A base type for any general stats.
 */
export class PlayerAnyGeneralStatsModelBase {
  /**
   * Average isolated deaths.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgIsolatedDeathCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Average solo kills.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgSoloKillCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Average forward %.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgForwardPercent: PlayerAnyGamePeriodStatsModel;

  /**
   * The average number of kills.
   */
  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  avgKillCount: number;

  /**
   * The average number of deaths.
   */
  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  avgDeathCount: number;

  /**
   * The average number of assists.
   */
  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  avgAssistCount: number;

  /**
   * The average number of total gold.
   */
  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  avgGoldCount: number;

  /**
   * The average total damage output.
   */
  @ApiModelProperty({ readOnly: true })
  @IsNumber()
  @Min(0)
  avgTotalDamage: number;
    
  /**
  * Initialization PlayerAnyGeneralStatsModelBase.
  */
  init() {
    this.avgKillCount = 0;
    this.avgDeathCount = 0;
    this.avgAssistCount = 0;
    this.avgGoldCount = 0;
    this.avgTotalDamage = 0;
    this.avgIsolatedDeathCount = new PlayerAnyGamePeriodStatsModel;
    this.avgSoloKillCount = new PlayerAnyGamePeriodStatsModel;
    this.avgForwardPercent = new PlayerAnyGamePeriodStatsModel;
    this.avgIsolatedDeathCount.init();
    this.avgSoloKillCount.init();
    this.avgForwardPercent.init();
  }
}

/**
 * Laning stats.
 */
export class PlayerAnyLaningStatsModelBase {
  /**
   * Avg Creep Score difference.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgCreepScoreDifferenceCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg gold difference.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgGoldDifferenceCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg EXP difference.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgExpDifferenceCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg time spend of lane (seconds).
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgTimeSpentOutOfLaneSeconds: PlayerAnyGamePeriodStatsModel;
      
  /**
  * Initialization PlayerAnyLaningStatsModelBase.
  */
  init() {
    this.avgCreepScoreDifferenceCount = new PlayerAnyGamePeriodStatsModel;
    this.avgGoldDifferenceCount = new PlayerAnyGamePeriodStatsModel;
    this.avgExpDifferenceCount = new PlayerAnyGamePeriodStatsModel;
    this.avgTimeSpentOutOfLaneSeconds = new PlayerAnyGamePeriodStatsModel;
    this.avgCreepScoreDifferenceCount.init();
    this.avgGoldDifferenceCount.init();
    this.avgExpDifferenceCount.init();
    this.avgTimeSpentOutOfLaneSeconds.init();
  }
}
