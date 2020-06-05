import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

export class GameBaronEventInfoModel {
  /**
   * Total number of barons that existed during the game.
   */
  @ApiModelProperty({
    description: 'Total number of barons that existed during the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int64,
  })
  @IsInt()
  totalCount: number;

  /**
   * Total number of barons that were killed by the red team during the game.
   */
  @ApiModelProperty({
    description:
      'Total number of barons that were killed by the team during the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int64,
  })
  @IsInt()
  killedCount: number;
}
