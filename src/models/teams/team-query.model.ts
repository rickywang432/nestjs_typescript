import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength, IsString } from 'class-validator';
import { QueryBase } from '../common';

/**
 * Contains search parameters for teams.
 */
export class TeamQuery extends QueryBase {
    /**
     * Search text.
     */
    @ApiModelPropertyOptional({ description: 'Search text.' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    text: string;
}