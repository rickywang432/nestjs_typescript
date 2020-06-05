import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, MaxLength, Min, ValidateNested, ArrayMaxSize, Allow } from 'class-validator';
import { DateRangeModel, QueryBase } from '../common';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameTeamSide, GameType } from '../game-common';

/**
 * Contains information about a filter by team or player.
 */
export class GameQueryTeamOrPlayer {
    /**
     * Team or player ID.
     */
    @ApiModelProperty({ description: 'Team or player ID.', type: OpenApiType.Integer, format: OpenApiFormat.Int32, minimum: 1 })
    @IsInt()
    @Min(1)
    id: number;

    /**
     * The side of the team or player.
     */
    @ApiModelPropertyOptional({ description: 'The side of the team or player.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsEnum(GameTeamSide)
    side?: GameTeamSide | undefined;

    /**
     * Indicate if the player/team must be a winner.
     */
    @ApiModelPropertyOptional({ description: 'Indicate if the player/team must be a winner.', type: OpenApiType.Boolean })
    @IsOptional()
    @Allow()
    isWinner?: boolean | undefined;
}

/**
 * The possible ways to sort items.
 */
export enum GameQuerySort {
    /**
     * Start time (ASC).
     */
    StartTimeAsc = 1,
    /**
     * Start time (DESC).
     */
    StartTimeDesc = 2,
}

/**
 * Contains game search parameters.
 */
export class GameQuery extends QueryBase {
    /**
     * Date range.
     */
    @ApiModelPropertyOptional({ description: 'Date range.', type: DateRangeModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => DateRangeModel)
    dateRange?: DateRangeModel | undefined;

    /**
     * The type of the game.
     */
    @ApiModelPropertyOptional({ description: 'The type of the game.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsEnum(GameType)
    gameType?: GameType | undefined;

    /**
     * Region ID (e.g. "na1").
     */
    @ApiModelPropertyOptional({ description: 'Region ID (e.g. "na1").', type: OpenApiType.String, maxLength: 50 })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    regionId?: string | undefined;

    /**
     * Patch (e.g. "10.1").
     */
    @ApiModelPropertyOptional({ description: 'Patch (e.g. "10.1").', type: OpenApiType.String, maxLength: 20 })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    patchId?: string | undefined;

    /**
     * Team filters (max 2).
     */
    @ApiModelPropertyOptional({ description: 'Team filters (max 2).', type: GameQueryTeamOrPlayer, isArray: true, maxItems: 2 })
    @IsOptional()
    @ValidateNested()
    @ArrayMaxSize(2)
    @Type(() => GameQueryTeamOrPlayer)
    teams?: GameQueryTeamOrPlayer[] | undefined;

    /**
     * Player filters (max 2).
     */
    @ApiModelPropertyOptional({ description: 'Player filters (max 2).', type: GameQueryTeamOrPlayer, isArray: true, maxItems: 2 })
    @IsOptional()
    @ValidateNested()
    @ArrayMaxSize(2)
    @Type(() => GameQueryTeamOrPlayer)
    players?: GameQueryTeamOrPlayer[] | undefined;

    /**
     * Sorting options. Th default is {@link GameQuerySort.StartTimeDesc}.
     */
    @ApiModelPropertyOptional({ description: 'Sorting options.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsEnum(GameQuerySort)
    sort?: GameQuerySort | undefined;
}
