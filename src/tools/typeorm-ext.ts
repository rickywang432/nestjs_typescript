import { UpdateResult, FindOperator, FindOperatorType, Connection } from 'typeorm';

/**
 * Helper methods and bug fixes for `typeorm`.
 * 
 * Extension methods guide: https://kimsereyblog.blogspot.com/2017/09/create-type-extensions-in-typescript.html
 */

declare module 'typeorm' {
    export interface UpdateResult {
        getAffectedRows(): number;
    }
}

/**
 * Contains the fields of a raw result.
 */
interface RawResult {
    affectedRows: number;
    changedRows: number;
    fieldCount: number;
    insertId: number;
}

/**
 * Initializes the module.
 */
export function init(): void {
    /**
     * Addresses an issue with `typeorm`: `UpdateResult.AffectedRows` is `undefined`.
     * https://github.com/typeorm/typeorm/issues/2415
     */
    UpdateResult.prototype.getAffectedRows = function (this: UpdateResult) {
        if (this.affected != undefined) {
            // Does not work with MySQL
            return this.affected;
        } else {
            // MySQL
            return (this.raw as RawResult).affectedRows;
        }
    }
}

class FindOperatorExt<T> extends FindOperator<T> {
    constructor(
        type: FindOperatorType | 'ilike',
        value: FindOperator<T> | T,
        useParameter?: boolean,
        multipleParameters?: boolean,
    ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        super(type, value, useParameter, multipleParameters);
    }

    public toSql(
        connection: Connection,
        aliasPath: string,
        parameters: string[],
    ): string {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (this._type === 'ilike') {
            return `${aliasPath} ILIKE ${parameters[0]}`;
        }

        return super.toSql(connection, aliasPath, parameters);
    }
}

/**
 * Find Options Operator.
 * Example: { someField: ILike("%some sting%") }
 */
export function ILike<T>(
    value: T | FindOperator<T>,
): FindOperatorExt<T> {
    return new FindOperatorExt('ilike', value);
}
