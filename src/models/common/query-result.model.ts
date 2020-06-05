import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { QueryPaginationModel } from './query-base.model';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains the result of a query.
 */
export class QueryResult<T> {
    /**
     * The list of items found by the query.
     */
    @ApiModelProperty({ readOnly: true, description: 'The list of items found by the query.', type: Object, isArray: true })
    items: T[];

    /**
     * The total number of items that were matches by the query.
     * @description CAUTION The total number of items can be greater than the number of items returned
     *              in the result due to pagination or other limits.
     */
    @ApiModelProperty({ readOnly: true, description: 'The list of items found by the query.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    totalCount: number;

    /**
     * Pagination (if any).
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'Pagination.', type: QueryPaginationModel })
    pagination?: QueryPaginationModel | undefined;

    constructor(items: T[], totalCount: number, pagination?: QueryPaginationModel) {
        this.items = items;
        this.totalCount = totalCount;
        this.pagination = pagination;
    }
}