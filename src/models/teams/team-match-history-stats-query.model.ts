import { IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { TeamStatsQueryBaseModel } from './team-stats-query-base.model';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { SortOrder } from '../common';

export enum TeamMatchHistoryQuerySort {
  /**
   * Solo Skills
   */
  SoloKills = 1,
  /**
   * Isolated Deaths
   */
  IsolatedDeaths = 2,
  /**
   * Gold Diff Pre-15
   */
  GoldDiffPre15 = 3,
  /**
   * Gold Diff Post-15
   */
  GoldDiffPost15 = 4,
  /**
   * CS Diff Pre-15
   */
  CSDiffPre15 = 5,
  /**
   * CS Diff Post-15
   */
  CSDiffPost15 = 6,
  /**
   * % Dragons
   */
  DragonsSecuredPercent = 7,
  /**
   * % Barons
   */
  BaronSecuredPercent = 8,
}

/**
 * Contains query parameters for team history match stats
 */
export class TeamMatchHistoryStatsQuery extends TeamStatsQueryBaseModel {
  /**
   * Filter victory only games
   */
  @ApiModelPropertyOptional({
    description: 'Filter victory only games',
    type: OpenApiType.Boolean,
  })
  @IsOptional()
  @IsBoolean()
  victoryOnly?: boolean | undefined;

  /**
   * Sort By
   */
  @ApiModelPropertyOptional({
    description: 'Sort By',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsEnum(TeamMatchHistoryQuerySort)
  sortBy?: TeamMatchHistoryQuerySort | undefined;

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
