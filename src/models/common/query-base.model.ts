import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Provides a way to paginate the results of a query.
 */
export class QueryPaginationModel {
    /**
     * A zero-based page index.
     */
    @ApiModelProperty({ description: 'The size of a page.', type: OpenApiType.Integer, format: OpenApiFormat.Int32, minimum: 1, maximum: 1000 })
    @IsInt()
    @Min(0)
    @Max(1000)
    pageIndex: number;

    /**
     * The size of a page.
     */
    @ApiModelProperty({ description: 'The size of a page.', type: OpenApiType.Integer, format: OpenApiFormat.Int32, minimum: 1, maximum: 100 })
    @IsInt()
    @Min(1)
    @Max(100)
    pageSize: number;
}

/**
 * A base type for any query.
 */
// tslint:disable-next-line:max-classes-per-file
export class QueryBase {
    /**
     * The maximum number of items to return.
     */
    @ApiModelPropertyOptional({
        description: 'The maximum number of items to return.',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
        minimum: 1,
        maximum: 500,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(500)
    maxItemCount?: number;

    /**
     * Pagination.
     */
    @ApiModelPropertyOptional({ description: 'Pagination.', type: QueryPaginationModel })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => QueryPaginationModel)
    pagination?: QueryPaginationModel;
}
