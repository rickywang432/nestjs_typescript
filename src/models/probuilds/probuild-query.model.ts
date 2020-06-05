import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsObject, ValidateNested, IsInt, Min, IsBoolean, MaxLength, IsString, IsArray } from 'class-validator';
import { QueryBase, DateRangeModel } from '../common';
import { PlayerRole } from '../players';
import { Type } from 'class-transformer';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameTeamSide, GameType } from '../game-common';

/**
 * Contains search parameters for players.
 */
export class ProbuildQuery extends QueryBase {
    /**
     * The ID of the player\'s champion.
     */
    @ApiModelPropertyOptional({ description: 'The ID of the player\'s champion.', type: OpenApiType.Integer, format: OpenApiFormat.Int64, isArray: true })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Min(1, { each: true })
    championIds?: number[] | undefined;

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
     * The role of the player.
     */
    @ApiModelPropertyOptional({
        description: 'The role of the player.',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsEnum(PlayerRole)
    role?: PlayerRole | undefined;

    /**
     * Team ID.
     */
    @ApiModelPropertyOptional({ description: 'Team ID.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsInt()
    @Min(1)
    teamId?: number | undefined;

    /**
     * Team side.
     */
    @ApiModelPropertyOptional({
        description: 'Red team or blue team',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsEnum(GameTeamSide)
    teamSide?: GameTeamSide | undefined;

    /**
     * Indicates if only victories should be included in the result.
     */
    @ApiModelPropertyOptional({ description: 'Indicates if only victories should be included in the result.', type: OpenApiType.Boolean })
    @IsOptional()
    @IsBoolean()
    winsOnly?: boolean | undefined;

    /**
     * LoL game software patch (e.g. "10.1");
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'LoL game software patch (e.g. "10.1");' })
    @IsOptional()
    @MaxLength(20)
    @IsString()
    patchId?: string | undefined;

    /**
     * LoL game type
     */
    @ApiModelPropertyOptional({
        description: 'Game type - solo, competitive or scrim games',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsEnum(GameType)
    gameType: GameType | undefined;
}
