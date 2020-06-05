import { PlayerAnyGamePeriodStatsModel, 
    PlayerAnyTeamFightDamageStatsModel, 
    PlayerAnyGeneralStatsModelBase, 
    PlayerAnyLaningStatsModelBase } from './player-stats.shared';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested, IsOptional } from 'class-validator';

/**
 * General stats.
 */
export class PlayerBottomGeneralStatsModel extends PlayerAnyGeneralStatsModelBase {
}

/**
 * Laning stats.
 */
export class PlayerBottomLaningStatsModel extends PlayerAnyLaningStatsModelBase {
}

/**
 * Vision stats.
 */
export class PlayerBottomVisionStatsModel {
    /**
     * Avg control wards bought.
     */
    @ApiModelProperty({ type: PlayerAnyGamePeriodStatsModel })
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerAnyGamePeriodStatsModel)
    avgControlWardsBoughtCount: PlayerAnyGamePeriodStatsModel;
        
    /**
     * Initialization PlayerBottomVisionStatsModel.
     */
    init() {
        this.avgControlWardsBoughtCount = new PlayerAnyGamePeriodStatsModel;
        this.avgControlWardsBoughtCount.init();
    }
}

/**
 * Contains information about stats of a user.
 */
export class PlayerBottomStatsModel {
    /**
     * General.
     */
    @ApiModelProperty({ type: PlayerBottomGeneralStatsModel })
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerBottomGeneralStatsModel)
    general: PlayerBottomGeneralStatsModel;

    /**
     * Vision.
     */
    @ApiModelProperty({ type: PlayerBottomVisionStatsModel })
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerBottomVisionStatsModel)
    vision: PlayerBottomVisionStatsModel;

    /**
     * Laning.
     */
    @ApiModelProperty({ type: PlayerBottomLaningStatsModel })
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerBottomLaningStatsModel)
    laning: PlayerBottomLaningStatsModel;

    /**
     * Total damage.
     */
    @ApiModelPropertyOptional({ type: PlayerAnyTeamFightDamageStatsModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerAnyTeamFightDamageStatsModel)
    totalDamage?: PlayerAnyTeamFightDamageStatsModel | undefined;

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
     * Initialization PlayerBottomStatsModel.
     */
    init() {
        this.general = new PlayerBottomGeneralStatsModel;
        this.vision = new PlayerBottomVisionStatsModel;
        this.laning = new PlayerBottomLaningStatsModel;
        this.teamFightDamage = new PlayerAnyTeamFightDamageStatsModel;
        this.general.init();
        this.vision.init();
        this.laning.init();
        this.teamFightDamage.init();
    }
}
