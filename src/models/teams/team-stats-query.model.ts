import { IsOptional, IsInt, Min } from 'class-validator';
import { TeamStatsQueryBaseModel } from './team-stats-query-base.model';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiFormat, OpenApiType } from '../open-api-type';

/**
 * Contains query parameter for player stats.
 */
export class TeamStatsQuery extends TeamStatsQueryBaseModel {
  /**
   * Compare to Team.
   */
  @ApiModelPropertyOptional({
    description: 'Compare to Team.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  compareToTeamId?: number | undefined;

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
  @Min(0)
  compareToLastNMatchCount?: number | undefined;
}
