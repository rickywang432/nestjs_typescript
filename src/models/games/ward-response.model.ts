import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { GameWardAggregationModel } from '../game-common';
import { IsOptional, ValidateNested, IsArray, ArrayMaxSize, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
export class WardResponse {

    /**
     * Maximum Game Length in seconds
     */
    @ApiModelProperty({
        description: 'Maximum Game Length in seconds',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsInt()
    @Min(0)
    @Max(10000)
    maxGameLength: number;

    /**
     * Most Common Wards placed in the map
     */
    @ApiModelPropertyOptional({ 
        description: 'Most Common Wards placed in the map', 
        type: GameWardAggregationModel, 
        isArray: true, 
    })
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @ArrayMaxSize(3000)
    @Type(() => GameWardAggregationModel)
    mostCommonWards?: GameWardAggregationModel[] | undefined;

    /**
     * First Wards placed in the map
     */
    @ApiModelPropertyOptional({ 
        description: 'First Wards placed in the map', 
        type: GameWardAggregationModel, 
        isArray: true, 
    })
    @IsOptional()
    @IsArray()
    @ValidateNested()
    @ArrayMaxSize(10)
    @Type(() => GameWardAggregationModel)
    firstWards?: GameWardAggregationModel[] | undefined;
}
