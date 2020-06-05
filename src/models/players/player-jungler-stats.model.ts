import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsObject, ValidateNested } from 'class-validator';
import {
  PlayerAnyGamePeriodStatsModel,
  PlayerAnyGamePeriodPortionStatsModel,
  PlayerAnyGeneralStatsModelBase,
  PlayerAnyLaningStatsModelBase,
} from './player-stats.shared';

/**
 * General stats.
 */
export class PlayerJunglerGeneralStatsModel extends PlayerAnyGeneralStatsModelBase {
}

/**
 * Jungling stats.
 */
export class PlayerJunglerJunglingStatsModel {
  /**
   * Avg number of camps taken.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodPortionStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodPortionStatsModel)
  avgCampsTakenCount: PlayerAnyGamePeriodPortionStatsModel;

  /**
   * Avg percent of scuttles.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodPortionStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodPortionStatsModel)
  avgScuttlesPercent: PlayerAnyGamePeriodPortionStatsModel;

  /**
   * Avg number of times revealed.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgTimesRevealedCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg duration of time revealed (seconds).
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgDurationOfTimeRevealedSeconds: PlayerAnyGamePeriodStatsModel;
          
  /**
  * Initialization PlayerJunglerJunglingStatsModel.
  */
  init() {
    this.avgCampsTakenCount = new PlayerAnyGamePeriodPortionStatsModel;
    this.avgScuttlesPercent = new PlayerAnyGamePeriodPortionStatsModel;
    this.avgTimesRevealedCount = new PlayerAnyGamePeriodStatsModel;
    this.avgDurationOfTimeRevealedSeconds = new PlayerAnyGamePeriodStatsModel;
    this.avgCampsTakenCount.init();
    this.avgScuttlesPercent.init();
    this.avgTimesRevealedCount.init();
    this.avgDurationOfTimeRevealedSeconds.init();
  }
}

/**
 * Laning stats.
 */
export class PlayerJunglerLaningStatsModel extends PlayerAnyLaningStatsModelBase {
}

/**
 * Lane interaction stats.
 */
export class PlayerLaneInteractionStatsItemModel {
  /**
   * Top lane.
   */
  @ApiModelProperty()
  @IsNumber()
  top: number;

  /**
   * Middle lane.
   */
  @ApiModelProperty()
  @IsNumber()
  middle: number;

  /**
   * Bottom lane.
   */
  @ApiModelProperty()
  @IsNumber()
  bottom: number;
      
  /**
  * Initialization PlayerAnyGeneralStatsModelBase.
  */
  init() {
    this.top = 0;
    this.middle = 0;
    this.bottom = 0;
  }

  add(op: PlayerLaneInteractionStatsItemModel) {
    this.top += op.top;
    this.middle += op.middle;
    this.bottom += op.bottom;
  }
}

/**
 * Lane interaction stats.
 */
export class PlayerJunglerLaneInteractionStatsModel {
  /**
   * Avg time of lane proximity at 10 mins (seconds).
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  avgLaneProximityTimeInSecondsPre10min: PlayerLaneInteractionStatsItemModel;

  /**
   * Avg time of lane proximity at 15 mins (seconds).
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  avgLaneProximityTimeInSecondsPre15min: PlayerLaneInteractionStatsItemModel;

  /**
   * The number of gank attempts.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  gankAttemptCount: PlayerLaneInteractionStatsItemModel;

  /**
   * The number of successful gank attempts.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  gankAttemptSuccessCount: PlayerLaneInteractionStatsItemModel;

  /**
   * The number of ganks executed on each lane as the first gank during a game.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  firstGankCountPerLane: PlayerLaneInteractionStatsItemModel;

  /**
   * The number of ganks succeed on each lane as the first gank during a game.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  firstGankSuccessCountPerLane: PlayerLaneInteractionStatsItemModel;

  /**
   * The percentage of ganks executed on teach lane as the second gank during a game.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  secondGankCountPerLane: PlayerLaneInteractionStatsItemModel;

  /**
   * The number of ganks succeed on each lane as the second gank during a game.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  secondGankSuccessCountPerLane: PlayerLaneInteractionStatsItemModel;

  /**
   * The percentage of ganks executed on teach lane as the third gank during a game.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  thirdGankCountPerLane: PlayerLaneInteractionStatsItemModel;

  /**
   * The number of ganks succeed on each lane as the third gank during a game.
   */
  @ApiModelProperty({ type: PlayerLaneInteractionStatsItemModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerLaneInteractionStatsItemModel)
  thirdGankSuccessCountPerLane: PlayerLaneInteractionStatsItemModel;

  /**
   * Time Spent within 8s of Top Laner.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  timeSpentWithin8SecondsOfTopLanerSeconds: PlayerAnyGamePeriodStatsModel;

  /**
   * Time Spent within 8s of Middle Laner.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  timeSpentWithin8SecondsOfMiddleLanerSeconds: PlayerAnyGamePeriodStatsModel;

  /**
   * Time Spent within 8s of Bottom Laner.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  timeSpentWithin8SecondsOfBottomLanerSeconds: PlayerAnyGamePeriodStatsModel;

  /**
   * Time Spent within 8s of Bottom Laner.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  timeSpentWithin8SecondsOfSupportSeconds: PlayerAnyGamePeriodStatsModel;
          
  /**
  * Initialization PlayerJunglerLaneInteractionStatsModel.
  */
  init() {
    this.avgLaneProximityTimeInSecondsPre10min = new PlayerLaneInteractionStatsItemModel;
    this.avgLaneProximityTimeInSecondsPre15min = new PlayerLaneInteractionStatsItemModel;
    this.gankAttemptCount = new PlayerLaneInteractionStatsItemModel;
    this.gankAttemptSuccessCount = new PlayerLaneInteractionStatsItemModel;
    this.firstGankCountPerLane = new PlayerLaneInteractionStatsItemModel;
    this.firstGankSuccessCountPerLane = new PlayerLaneInteractionStatsItemModel;
    this.secondGankCountPerLane = new PlayerLaneInteractionStatsItemModel;
    this.secondGankSuccessCountPerLane = new PlayerLaneInteractionStatsItemModel;
    this.thirdGankCountPerLane = new PlayerLaneInteractionStatsItemModel;
    this.thirdGankSuccessCountPerLane = new PlayerLaneInteractionStatsItemModel;
    this.timeSpentWithin8SecondsOfTopLanerSeconds = new PlayerAnyGamePeriodStatsModel;
    this.timeSpentWithin8SecondsOfMiddleLanerSeconds = new PlayerAnyGamePeriodStatsModel;
    this.timeSpentWithin8SecondsOfBottomLanerSeconds = new PlayerAnyGamePeriodStatsModel;
    this.timeSpentWithin8SecondsOfSupportSeconds = new PlayerAnyGamePeriodStatsModel;
    this.avgLaneProximityTimeInSecondsPre10min.init();
    this.avgLaneProximityTimeInSecondsPre15min.init();
    this.gankAttemptCount.init();
    this.gankAttemptSuccessCount.init();
    this.firstGankCountPerLane.init();
    this.firstGankSuccessCountPerLane.init();
    this.secondGankCountPerLane.init();
    this.secondGankSuccessCountPerLane.init();
    this.thirdGankCountPerLane.init();
    this.thirdGankSuccessCountPerLane.init();
    this.timeSpentWithin8SecondsOfTopLanerSeconds.init();
    this.timeSpentWithin8SecondsOfMiddleLanerSeconds.init();
    this.timeSpentWithin8SecondsOfBottomLanerSeconds.init();
    this.timeSpentWithin8SecondsOfSupportSeconds.init();
  }
}

/**
 * Contains information about stats of a user.
 */
export class PlayerJunglerStatsModel {
  /**
   * General.
   */
  @ApiModelProperty({ type: PlayerJunglerGeneralStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerJunglerGeneralStatsModel)
  general: PlayerJunglerGeneralStatsModel;

  /**
   * Laning.
   */
  @ApiModelProperty({ type: PlayerJunglerLaningStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerJunglerLaningStatsModel)
  laning: PlayerJunglerLaningStatsModel;

  /**
   * Jungling.
   */
  @ApiModelProperty({ type: PlayerJunglerJunglingStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerJunglerJunglingStatsModel)
  jungling: PlayerJunglerJunglingStatsModel;

  /**
   * Avg control wards / min.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgControlWardsBoughtCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Lane interaction.
   */
  @ApiModelProperty({ type: PlayerJunglerLaneInteractionStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerJunglerLaneInteractionStatsModel)
  laneInteraction: PlayerJunglerLaneInteractionStatsModel;
        
  /**
  * Initialization PlayerJunglerStatsModel.
  */
  init() {
    this.general = new PlayerJunglerGeneralStatsModel;
    this.laning = new PlayerJunglerLaningStatsModel;
    this.jungling = new PlayerJunglerJunglingStatsModel;
    this.laneInteraction = new PlayerJunglerLaneInteractionStatsModel;
    this.general.init();
    this.laning.init();
    this.jungling.init();
    this.laneInteraction.init();
  }
}
