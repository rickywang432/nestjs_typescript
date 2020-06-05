import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about the build of a champion.
 */
export class ChampionBuildPathModel {
    @ApiModelProperty({ description: 'Item ID', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsInt()
    itemId: number;

    @ApiModelProperty({ description: 'Item timestamp', type: OpenApiType.String, format: OpenApiFormat.Int32 })
    @IsInt()
    timestamp: number;
}
