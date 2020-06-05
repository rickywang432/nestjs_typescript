import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { GameTeamSide, WardQueryType, WardType } from '../game-common';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { TeamStatsQueryBaseModel } from '../teams';

export class TeamWardQuery extends TeamStatsQueryBaseModel {

    /**
     * Ward Query Type - that is 'Most Common' or 'First Ward'
     */
    @ApiModelPropertyOptional({
        description: 'Ward Query Type. 1 for "Most Common", 2 for "First Ward"', 
        type: OpenApiType.Integer, 
        format: OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsEnum(WardQueryType)
    wardQueryType?: WardQueryType | undefined;

    /**
     * Start Time
     */
    @ApiModelPropertyOptional({ 
        description: 'Start Time in seconds', 
        type: OpenApiType.Integer, 
        format:OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsInt()
    startTime?: number | undefined;

    /**
     * End Time
     */
    @ApiModelPropertyOptional({ 
        description: 'End Time in seconds', 
        type: OpenApiType.Integer, 
        format:OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsInt()
    endTime?: number | undefined;

    /**
     * Ward Type - 'Control Ward' or 'Regular Ward'
     */
    @ApiModelPropertyOptional({
        description: 'Ward Type. 1 for "Control Ward", 2 "Regular Ward")', 
        type: OpenApiType.Integer, 
        format:OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsEnum(WardType)
    wardType?: WardType | undefined;

    /**
     * Team
     */
    @ApiModelPropertyOptional({
        description: 'Team Side. 1 for "Red Team", 2 for "Blue Team"', 
        type: OpenApiType.Integer, 
        format:OpenApiFormat.Int32,
    })
    @IsOptional()
    @IsEnum(GameTeamSide)
    teamSide?: GameTeamSide | undefined;
}