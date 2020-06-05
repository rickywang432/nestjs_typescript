import { PlayerTopStatsModel } from './player-top-stats.model';
import { PlayerMiddleStatsModel } from './player-middle-stats.model';
import { PlayerBottomStatsModel } from './player-bottom-stats.model';
import { PlayerJunglerStatsModel } from './player-jungler-stats.model';
import { PlayerSupportStatsModel } from './player-support-stats.model';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested, IsObject } from 'class-validator';

/**
 * Contains information about stats of a user.
 */
export class PlayerStatsModel {
    /**
     * Top role.
     */
    @ApiModelPropertyOptional({ type: PlayerTopStatsModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerTopStatsModel)
    top?: PlayerTopStatsModel | undefined;

    /**
     * Middle role.
     */
    @ApiModelPropertyOptional({ type: PlayerMiddleStatsModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerMiddleStatsModel)
    middle?: PlayerMiddleStatsModel | undefined;

    /**
     * Bottom role.
     */
    @ApiModelPropertyOptional({ type: PlayerBottomStatsModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerBottomStatsModel)
    bottom?: PlayerBottomStatsModel | undefined;

    /**
     * Jungler role.
     */
    @ApiModelPropertyOptional({ type: PlayerJunglerStatsModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerJunglerStatsModel)
    jungler?: PlayerJunglerStatsModel | undefined;

    /**
     * Support role.
     */
    @ApiModelPropertyOptional({ type: PlayerSupportStatsModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => PlayerSupportStatsModel)
    support?: PlayerSupportStatsModel | undefined;

    /**
     * Initialization PlayerStatsModel.
     */
    init() {
        this.top = new PlayerTopStatsModel;
        this.middle = new PlayerMiddleStatsModel;
        this.bottom = new PlayerBottomStatsModel;
        this.jungler = new PlayerJunglerStatsModel;
        this.support = new PlayerSupportStatsModel;
        this.top.init();
        this.middle.init();
        this.bottom.init();
        this.jungler.init();
        this.support.init();
    }
}