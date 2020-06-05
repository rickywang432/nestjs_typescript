import {
  PlayerAnyGamePeriodStatsModel,
  PlayerAnyTeamFightDamageStatsModel,
  PlayerAnyLaningStatsModelBase,
  PlayerAnyGeneralStatsModelBase,
} from './player-stats.shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested, IsOptional } from 'class-validator';

/**
 * General stats.
 */
export class PlayerTopGeneralStatsModel extends PlayerAnyGeneralStatsModelBase {
  /**
   * The amount of gold generated within 1m after teleport.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgGoldGeneratedWithin1mOfTeleportCount: PlayerAnyGamePeriodStatsModel;
  
  /**
   * Initialization PlayerTopGeneralStatsModel.
   */
  init() {
    super.init();
    this.avgGoldGeneratedWithin1mOfTeleportCount = new PlayerAnyGamePeriodStatsModel;
    this.avgGoldGeneratedWithin1mOfTeleportCount.init();  
  }
  
}

/**
 * Laning stats.
 */
export class PlayerTopLaningStatsModel extends PlayerAnyLaningStatsModelBase {
}

/**
 * Vision stats.
 */
export class PlayerTopVisionStatsModel {
  /**
   * Avg control wards bought.
   */
  @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerAnyGamePeriodStatsModel)
  avgControlWardsBoughtCount: PlayerAnyGamePeriodStatsModel;
  /**
  * Initialization PlayerTopVisionStatsModel.
  */
  init() {
    this.avgControlWardsBoughtCount = new PlayerAnyGamePeriodStatsModel;
    this.avgControlWardsBoughtCount.init();
  }
}

/**
 * Contains information about stats of a user.
 */
export class PlayerTopStatsModel {
  /**
   * General.
   */
  @ApiModelProperty({ type: PlayerTopGeneralStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerTopGeneralStatsModel)
  general: PlayerTopGeneralStatsModel;

  /**
   * Vision.
   */
  @ApiModelProperty({ type: PlayerTopVisionStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerTopVisionStatsModel)
  vision: PlayerTopVisionStatsModel;

  /**
   * Laning.
   */
  @ApiModelProperty({ type: PlayerTopLaningStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => PlayerTopLaningStatsModel)
  laning: PlayerTopLaningStatsModel;

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
   * Initialization PlayerTopStatsModel.
   */
  init() {
    this.general = new PlayerTopGeneralStatsModel;
    this.vision = new PlayerTopVisionStatsModel;
    this.laning = new PlayerTopLaningStatsModel;
    this.teamFightDamage = new PlayerAnyTeamFightDamageStatsModel;
    this.general.init();
    this.vision.init();
    this.laning.init();
    this.teamFightDamage.init();
  }
}
