import {
  PlayerAnyGamePeriodStatsModel,
  PlayerAnyGeneralStatsModelBase,
  PlayerAnyLaningStatsModelBase,
} from './player-stats.shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested, IsOptional, IsInt, IsNumber, IsArray, ArrayMaxSize } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * General stats.
 */
export class PlayerSupportGeneralStatsModel extends PlayerAnyGeneralStatsModelBase {
  /**
   * The average Roams.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgRoams: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg. Jungle/Support Proximity.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgJungleOrSupportProximity: PlayerAnyGamePeriodStatsModel;

  /**
   * Initialization PlayerSupportGeneralStatsModel.
   */
  init() {
    super.init();
    this.avgRoams = new PlayerAnyGamePeriodStatsModel;
    this.avgJungleOrSupportProximity = new PlayerAnyGamePeriodStatsModel;
    this.avgRoams.init();
    this.avgJungleOrSupportProximity.init();
  }
}

/**
 * Laning stats.
 */
export class PlayerSupportLaningStatsModel extends PlayerAnyLaningStatsModelBase {
}

/**
 * Vision stats.
 */
export class PlayerSupportVisionStatsModel {
  /**
   * Avg number of wards placed.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgWardsPlacedCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg number of cases of wards revealed.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgWardsRevealedCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Sweeper efficiency (# of wards cleared pre 15 minutes and post 15 per minutes on avg of past 15 games).
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  sweeperEfficiency: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg control wards / min.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgControlWardsPerMinCount: PlayerAnyGamePeriodStatsModel;

  /**
  * Initialization PlayerSupportVisionStatsModel.
  */
  init() {
    this.avgWardsPlacedCount = new PlayerAnyGamePeriodStatsModel;
    this.avgWardsRevealedCount = new PlayerAnyGamePeriodStatsModel;
    this.sweeperEfficiency = new PlayerAnyGamePeriodStatsModel;
    this.avgControlWardsPerMinCount = new PlayerAnyGamePeriodStatsModel;
    this.avgWardsPlacedCount.init();
    this.avgWardsRevealedCount.init();
    this.sweeperEfficiency.init();
    this.avgControlWardsPerMinCount.init();
  }
}

/**
 * Support item stats.
 */
export class PlayerSupportSupportItemsStatsModel {

  /**
   * ID of the Support item that are being considered
   */
  @ApiModelPropertyOptional({
    description: 'ID of the Support item',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsInt()
  itemId: number;

  /**
   * Avg. Diff of 2 supports gold from this item pre 15 mins
   */
  @ApiModelPropertyOptional({
    description: 'Difference of Gold earned by this support item Pre @15',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double
  })
  @IsNumber()
  avgGoldDiffFromItemsPre15: number;

  /**
   * Avg. Diff of golds not earned from this item pre 15 mins
   */
  @ApiModelPropertyOptional({ 
    description: 'Difference of Gold earned NOT by this support item Pre @15', 
    type: OpenApiType.Number,
    format: OpenApiFormat.Double
  })
  @IsNumber()
  avgGoldDiffWithoutItemsPre15: number;

  /**
   * Avg. Diff of total gold earned pre 15mins
   */
  @ApiModelPropertyOptional({ 
    description: 'Total Gold Difference Pre @15', 
    type: OpenApiType.Number,
    format: OpenApiFormat.Double
  })
  @IsNumber()
  avgTotalGoldDiffPre15: number;

  /**
   * Avg. Completion Time (in seconds) of this support item
   */
  @ApiModelPropertyOptional({ 
    description: 'Completion time of this support item', 
    type: OpenApiType.Number,
    format: OpenApiFormat.Double
  })
  @IsNumber()
  avgSuppItemCompleteTimeInSeconds: number;
}

/**
 * Contains information about stats of a user.
 */
export class PlayerSupportStatsModel {
  /**
   * General.
   */
  @ApiModelProperty({ type: PlayerSupportGeneralStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerSupportGeneralStatsModel)
  general: PlayerSupportGeneralStatsModel;

  /**
   * Laning.
   */
  @ApiModelProperty({ type: PlayerSupportLaningStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerSupportLaningStatsModel)
  laning: PlayerSupportLaningStatsModel;

  /**
   * Support items.
   */
  @ApiModelPropertyOptional({ description: 'Support items', type: PlayerSupportSupportItemsStatsModel, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(4)
  @ValidateNested()
  @Type(() => PlayerSupportSupportItemsStatsModel)
  supportItems?: PlayerSupportSupportItemsStatsModel[] | undefined;

  /**
   * Vision.
   */
  @ApiModelProperty({ type: PlayerSupportVisionStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerSupportVisionStatsModel)
  vision: PlayerSupportVisionStatsModel;

  /**
  * Initialization PlayerSupportStatsModel.
  */
  init() {
    this.general = new PlayerSupportGeneralStatsModel;
    this.laning = new PlayerSupportLaningStatsModel;
    this.vision = new PlayerSupportVisionStatsModel;
    this.general.init();
    this.laning.init();
    this.vision.init();
  }
}
