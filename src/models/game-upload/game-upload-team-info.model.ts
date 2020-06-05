import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsInt,
  IsArray,
  IsObject,
  IsOptional,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { ChampionPickInfoModel } from '../teams';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameUploadPlayerInfoModel } from './game-upload-player-info.model';
import { GameUploadTeamStatsModel } from './game-upload-team-stats.model';

/**
 * Information about a team during a game.
 */
export class GameUploadTeamInfoModel {
  /**
   * Information about the players in the teams.
   */
  @ApiModelProperty({
    description: 'Information about the players in the teams.',
    type: GameUploadPlayerInfoModel,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @ArrayMaxSize(5)
  @ArrayNotEmpty()
  @Type(() => GameUploadPlayerInfoModel)
  players: GameUploadPlayerInfoModel[];

  /**
   * The order of picking Roles in Champion Selection Phase
   */
  @ApiModelPropertyOptional({
    description: 'The order of picking Roles in Champion Selection Phase.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
    isArray: true,
  })
  @IsArray()
  @IsInt({ each: true })
  @ArrayMaxSize(5)
  pickedRolesByOrder: number[] | undefined;

  /**
   * The IDs of the champions banned by the team.
   */
  @ApiModelPropertyOptional({
    description: 'The IDs of the champions banned by the team.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayMaxSize(5)
  bannedChampionIds: number[] | undefined;

  /**
   * Blind picks
   */
  @ApiModelProperty({
    description: 'Blind picks',
    type: ChampionPickInfoModel,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @ArrayMaxSize(5)
  @ArrayNotEmpty()
  @Type(() => ChampionPickInfoModel)
  blindPicks: ChampionPickInfoModel[];

  /**
   * Counter picks
   */
  @ApiModelProperty({
    description: 'Counter picks',
    type: ChampionPickInfoModel,
    isArray: true,
  })
  @IsArray()
  @ValidateNested()
  @ArrayMaxSize(5)
  @ArrayNotEmpty()
  @Type(() => ChampionPickInfoModel)
  counterPicks: ChampionPickInfoModel[];

  /**
   * Uploading Statistics for Team: 
   *  - Objectives
   *  - Laning
   *  - Turret Plates Taken
   */
  @ApiModelProperty({
    description: 'Statistics for Team: Objectives, Laning, Turret Plates Taken',
    type: GameUploadTeamStatsModel,
  })
  @IsObject()
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => GameUploadTeamStatsModel)
  stats: GameUploadTeamStatsModel;
}
