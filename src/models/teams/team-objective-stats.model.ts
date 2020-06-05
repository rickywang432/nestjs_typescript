import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Min,
  Max,
  IsObject,
  ValidateNested,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { GameDragonInfoModel, GameBaronEventInfoModel } from '../game-common';
/**
 * First Kill Success and time
 */
export class TeamObjectivesFirstObjectivesKillStatsModel {
  /**
   * Have first kill?
   */
  @ApiModelProperty()
  @IsBoolean()
  isSuccess: boolean;

  /**
   * Time (seconds)
   */
  @ApiModelProperty()
  @IsNumber()
  @Min(0)
  @Max(3600 * 24)
  time: number;
}

/**
 * Objectives
 */
export class TeamObjectivesStatsModel {
  /**
   * First Dragon Kill Stats and Time
   */
  @ApiModelPropertyOptional({
    type: TeamObjectivesFirstObjectivesKillStatsModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TeamObjectivesFirstObjectivesKillStatsModel)
  firstDragon?: TeamObjectivesFirstObjectivesKillStatsModel | undefined;

  /**
   * First Herald  Kill Stats and Time
   */
  @ApiModelPropertyOptional({
    type: TeamObjectivesFirstObjectivesKillStatsModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TeamObjectivesFirstObjectivesKillStatsModel)
  firstHerald?: TeamObjectivesFirstObjectivesKillStatsModel | undefined;

  /**
   * First Baron  Kill Stats and Time
   */
  @ApiModelPropertyOptional({
    type: TeamObjectivesFirstObjectivesKillStatsModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TeamObjectivesFirstObjectivesKillStatsModel)
  firstBaron?: TeamObjectivesFirstObjectivesKillStatsModel | undefined;

  /**
   * Dragons Stats.
   */
  @ApiModelPropertyOptional({
    description: 'Dragons Stats.',
    type: GameDragonInfoModel,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => GameDragonInfoModel)
  dragons?: GameDragonInfoModel | undefined;

  /**
   * Baron Stats.
   */
  @ApiModelPropertyOptional({
    description: 'Baron Stats.',
    type: GameBaronEventInfoModel,
  })
  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => GameBaronEventInfoModel)
  baron?: GameBaronEventInfoModel | undefined;
}
