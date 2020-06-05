/**
 * The possible results of a DB modification (e.g. insert or update) operation.
 */
export enum DbModificationOperationResult {
    /**
     * The operation completed successfully.
     */
    Success = 0,
    /**
     * The record does not exist and cannot be updated.
     */
    NotFound = 1,
    /**
     * The operation cannot be executed due to the state of the record (e.g. updating a read-only record).
     */
    InvalidOperation = 2,
}