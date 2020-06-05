import {
  PlayerAnyGamePeriodStatsModel,
  PlayerAnyTeamFightDamageStatsModel,
  PlayerAnyGeneralStatsModelBase,
  PlayerAnyLaningStatsModelBase,
} from './player-stats.shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested, IsOptional } from 'class-validator';

/**
 * General stats.
 */
export class PlayerMiddleGeneralStatsModel extends PlayerAnyGeneralStatsModelBase {
}

/**
 * Laning stats.
 */
export class PlayerMiddleLaningStatsModel extends PlayerAnyLaningStatsModelBase {}

/**
 * Vision stats.
 */
export class PlayerMiddleVisionStatsModel {
  /**
   * Avg control wards bought.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgControlWardsBoughtCount: PlayerAnyGamePeriodStatsModel;
    
  /**
  * Initialization PlayerMiddleVisionStatsModel.
  */
  init() {
    this.avgControlWardsBoughtCount = new PlayerAnyGamePeriodStatsModel;
    this.avgControlWardsBoughtCount.init();
  }
}

/**
 * Contains information about stats of a user.
 */
export class PlayerMiddleStatsModel {
  /**
   * General.
   */
  @ApiModelProperty({ type: PlayerMiddleGeneralStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerMiddleGeneralStatsModel)
  general: PlayerMiddleGeneralStatsModel;

  /**
   * Vision.
   */
  @ApiModelProperty({ type: PlayerMiddleVisionStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerMiddleVisionStatsModel)
  vision: PlayerMiddleVisionStatsModel;

  /**
   * Laning.
   */
  @ApiModelProperty({ type: PlayerMiddleLaningStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerMiddleLaningStatsModel)
  laning: PlayerMiddleLaningStatsModel;

  /**
   * Team fight damage.
   */
  @ApiModelPropertyOptional({ type: PlayerAnyTeamFightDamageStatsModel })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyTeamFightDamageStatsModel)
  teamFightDamage?: PlayerAnyTeamFightDamageStatsModel | undefined;
  
  /**
   * Initialization PlayerMiddleStatsModel.
   */
  init() {
    this.general = new PlayerMiddleGeneralStatsModel;
    this.vision = new PlayerMiddleVisionStatsModel;
    this.laning = new PlayerMiddleLaningStatsModel;
    this.teamFightDamage = new PlayerAnyTeamFightDamageStatsModel;
    this.general.init();
    this.vision.init();
    this.laning.init();
    this.teamFightDamage.init();
  }
}
