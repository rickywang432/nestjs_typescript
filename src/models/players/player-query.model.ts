import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';
import { QueryBase } from '../common';
import { OpenApiType } from '../open-api-type';

/**
 * Contains search parameters for players.
 */
export class PlayerQuery extends QueryBase {
  /**
   * Search text.
   */
  @ApiModelPropertyOptional({ description: 'Search text.' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  text: string;

  /**
   * Indicates if team data should be included in the result
   */
  @ApiModelPropertyOptional({
    description: 'Indicates if team info should be included in the result',
    type: OpenApiType.Boolean,
  })
  @IsOptional()
  @IsBoolean()
  includeTeamInfo?: boolean | undefined;

  // DEPRECATED
  // /**
  //  * The role of the players to return.
  //  */
  // @ApiModelPropertyOptional({ description: 'The role of the players to return.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
  // @IsOptional()
  // @IsEnum(PlayerRole)
  // playerRole?: PlayerRole | undefined;
}
