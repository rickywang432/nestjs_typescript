import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsObject,
  IsOptional,
  MaxLength,
  ValidateNested,
  IsString,
  MinLength,
} from 'class-validator';
import { GameUploadTeamInfoModel } from './game-upload-team-info.model';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameWardInfoModel, GameType, GameTeamSide } from '../game-common';

/**
 * Contains information about a game.
 */
export class GameUploadInfoModel {
  /**
   * The time the game has started.
   */
  @ApiModelProperty({
    description: 'The time the game has started.',
    type: OpenApiType.String,
    format: OpenApiFormat.DateTime,
  })
  @IsDate()
  @Type(() => Date) // Convert string to Date during deserialization
  gameStart: Date;

  /**
   * The time the game has concluded.
   */
  @ApiModelProperty({
    description: 'The time the game has started.',
    type: OpenApiType.String,
    format: OpenApiFormat.DateTime,
  })
  @IsDate()
  @Type(() => Date) // Convert string to Date during deserialization
  gameEnd: Date;

  /**
   * Type.
   */
  @ApiModelProperty({
    description: 'Type.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsEnum(GameType)
  gameType: GameType;

  /**
   * Region ID (e.g. "na1").
   */
  @ApiModelProperty({ description: 'Region ID (e.g. "na1").' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  regionId: string;

  /**
   * LoL game software patch (e.g. "10.1");
   */
  @ApiModelProperty({ description: 'LoL game software patch (e.g. "10.1");' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  patchId: string;

  /**
   * Information about the red team.
   */
  @ApiModelProperty({
    description: 'Information about the red team.',
    type: GameUploadTeamInfoModel,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GameUploadTeamInfoModel)
  redTeam: GameUploadTeamInfoModel;

  /**
   * Information about the blue team.
   */
  @ApiModelProperty({
    description: 'Information about the blue team.',
    type: GameUploadTeamInfoModel,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => GameUploadTeamInfoModel)
  blueTeam: GameUploadTeamInfoModel;

  /**
   * Who is the winning team?
   */
  @ApiModelProperty({
    description: 'Who is the winning team?',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsEnum(GameTeamSide)
  winnerTeamSide: GameTeamSide;

  /**
   * Wards.
   */
  @ApiModelPropertyOptional({
    description: 'Wards.',
    type: GameWardInfoModel,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => GameWardInfoModel)
  wards: GameWardInfoModel | undefined;
}
