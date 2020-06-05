import { GameType, GameTeamSide } from '../game-common';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { DateRangeModel } from '../common';
import {
  MaxLength,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsObject,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { Type } from 'class-transformer';

/**
 * Contains query parameter for player stats.
 */
export class PlayerStatsQuery {
  /**
   * Date range.
   */
  @ApiModelPropertyOptional({
    description: 'Date range.',
    type: DateRangeModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DateRangeModel)
  dateRange?: DateRangeModel | undefined;

  /**
   * The type of the game.
   */
  @ApiModelPropertyOptional({
    description: 'The type of the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(GameType)
  gameType?: GameType | undefined;

  /**
   * Region ID (e.g. "na1").
   */
  @ApiModelPropertyOptional({
    description: 'Region ID (e.g. "na1").',
    type: OpenApiType.String,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  regionId?: string | undefined;

  /**
   * Patch (e.g. "10.1").
   */
  @ApiModelPropertyOptional({
    description: 'Patch (e.g. "10.1").',
    type: OpenApiType.String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  patchId?: string | undefined;

  /**
   * Versus player.
   */
  @ApiModelPropertyOptional({
    description: 'Versus player.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  versusPlayerId?: number | undefined;

  /**
   * Compare to player.
   */
  @ApiModelPropertyOptional({
    description: 'Compare to player.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  compareToPlayerId?: number | undefined;

  /**
   * Compare to all players in region from the same lane.
   */
  @ApiModelPropertyOptional({
    description: 'Compare to all players in region.',
    type: OpenApiType.String,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  compareToAllCompetitivePlayersInRegionId?: string | undefined;

  /**
   * Compare to the last N number of matches of any type.
   */
  @ApiModelPropertyOptional({
    description: 'Compare to the last N number of matches of any type.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  compareToLastNMatchCount?: number | undefined;

  /**
   * The side of the team.
   */
  @ApiModelPropertyOptional({
    description: 'The side of the team.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(GameTeamSide)
  teamSide?: GameTeamSide | undefined;

  /**
   * Champion Id
   */

  @ApiModelPropertyOptional({
    description: 'championId',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  championId?: number | undefined;
}
