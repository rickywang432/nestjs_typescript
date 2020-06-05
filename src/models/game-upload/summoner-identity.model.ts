import { ApiModelProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about the identity of the summoner.
 */
export class SummonerIdentityModel {
    /**
     * The ID of the summoner.
     */
    @ApiModelProperty({ description: 'The ID of the summoner.', type: OpenApiType.Integer, format: OpenApiFormat.Int64 })
    @IsInt()
    id: number;

    /**
     * The name of the summoner.
     */
    @ApiModelProperty({ description: 'The name of the summoner.' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    /**
     * The internal name of the summoner.
     */
    @ApiModelProperty({ description: 'The internal name of the summoner.' })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    internalName: string;
}