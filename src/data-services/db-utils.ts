import { SelectQueryBuilder, FindManyOptions } from 'typeorm';
import { QueryBase } from '../models';

/**
 * Defies a sorting map.
 */
export type SortMap = Map<number, { sort: string, order?: 'ASC' | 'DESC' }>;

/**
 * Adds pagination arguments to a query.
 * @param dbQuery
 * @param query
 */
function addPagination<Entity>(dbQuery: SelectQueryBuilder<Entity> | FindManyOptions<Entity>, query: QueryBase) : void {
    if (dbQuery instanceof SelectQueryBuilder) {
        if (query.pagination != undefined) {
            dbQuery.skip(query.pagination.pageIndex * query.pagination.pageSize);
            dbQuery.take(query.pagination.pageSize);
        } else if (query.maxItemCount != undefined) {
            dbQuery.take(query.maxItemCount);
        }
    } else {
        if (query.pagination != undefined) {
            dbQuery.skip = query.pagination.pageIndex * query.pagination.pageSize;
            dbQuery.take = query.pagination.pageSize;
        } else if (query.maxItemCount != undefined) {
            dbQuery.take = query.maxItemCount;
        }
    }
}

/**
 * Adds sorting to a query.
 * @param dbQuery
 */
function addSorting<Entity>(
    dbQuery: SelectQueryBuilder<Entity>,
    sortMap: SortMap,
    sortValues: (number | undefined)[],
    defaultSort?: number
) : void {
    // Indicates if sorting has bee added to the query
    let sortSet = false;
    if (sortValues == undefined || sortValues.length == 0) {
        // No sorting values
    } else {
        for (const value of sortValues) {
            if (value == undefined) {
                continue;
            }

            const sortExpression = sortMap.get(value);
            if (sortExpression == undefined) {
                continue;
            }

            if (sortSet) {
                dbQuery.addOrderBy(sortExpression.sort, sortExpression.order);
            } else {
                dbQuery.orderBy(sortExpression.sort, sortExpression.order);
                sortSet = true;
            }
        }
    }

    if (false == sortSet && defaultSort != undefined) {
        const sortExpression = sortMap.get(defaultSort);
        if (sortExpression != undefined) {
            dbQuery.orderBy(sortExpression.sort, sortExpression.order);
        }
    }
}

export const DbUtils = {
    addPagination,
    addSorting,
};
