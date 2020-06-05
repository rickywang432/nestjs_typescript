import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains a date range.
 */
export class DateRangeModel {
    /**
     * Start date.
     */
    @ApiModelPropertyOptional({ description: 'Start date.', type: OpenApiType.String, format: OpenApiFormat.Date })
    @IsOptional()
    @IsDate()
    @Type(() => Date) // Convert string to Date during deserialization
    start?: Date | undefined;

    /**
     * End date.
     */
    @ApiModelPropertyOptional({ description: 'End date.', type: OpenApiType.String, format: OpenApiFormat.Date })
    @IsOptional()
    @IsDate()
    @Type(() => Date) // Convert string to Date during deserialization
    end?: Date | undefined;
}