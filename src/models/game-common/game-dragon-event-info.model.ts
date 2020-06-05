import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Dragon Status
 */
export class GameDragonEventInfoModel {
  /**
   * Total number of dragons that existed during the game.
   */
  @ApiModelProperty({
    description: 'Total number of dragons that existed during the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int64,
  })
  @IsInt()
  totalCount: number;

  /**
   * Total number of dragons that were killed by the team during the game.
   */
  @ApiModelProperty({
    description:
      'Total number of dragons that were killed by the team during the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int64,
  })
  @IsInt()
  killedCount: number;
}
