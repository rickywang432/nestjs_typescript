import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { TeamStatsQueryBaseModel } from './team-stats-query-base.model';

import { PlayerRole } from '../players';
import { SortOrder } from '../common';

export enum TeamChampionsQuerySort {
  /**
   * Pick Rate
   */
  PickRate = 1,
}

/**
 * Contains information about the champions of the team
 */
export class TeamChampionsStatsQuery extends TeamStatsQueryBaseModel {
  /**
   * The ID of the player's champion.
   */
  @ApiModelPropertyOptional({
    description: 'The ID of the player\'s champion.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsInt()
  @IsOptional()
  championId?: number | undefined;

  /**
   * The role of the player during the game.
   */
  @ApiModelPropertyOptional({
    description: 'The role of the player during the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(PlayerRole)
  role?: PlayerRole | undefined;

  /**
   * Sort By
   */
  @ApiModelPropertyOptional({
    description: 'Sort By',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(TeamChampionsQuerySort)
  sortBy?: TeamChampionsQuerySort | undefined;

  /**
   * Sort Order
   */
  @ApiModelPropertyOptional({
    description: 'Sort Order',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder | undefined;
}
