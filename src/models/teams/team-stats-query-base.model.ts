import {
  IsOptional,
  IsEnum,
  IsObject,
  ValidateNested,
  MaxLength,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GameType, GameTeamSide } from '../game-common';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { DateRangeModel, QueryBase } from '../common';
import { OpenApiFormat, OpenApiType } from '../open-api-type';

/**
 * Contains query base parameters for team stats.
 */
export class TeamStatsQueryBaseModel extends QueryBase {
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
   * Versus Team.
   */
  @ApiModelPropertyOptional({
    description: 'Versus Team.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  versusTeamId?: number | undefined;

  /**
   * Focused team side to be used when aggregating the team stats.
   */
  @ApiModelPropertyOptional({
    description:
      'Focused team side to be used when aggregating the team stats.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(GameTeamSide)
  teamSide?: GameTeamSide | undefined;
}
