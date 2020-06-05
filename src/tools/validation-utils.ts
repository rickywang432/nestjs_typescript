/**
 * Checks if a value is a valid game UID.
 * @param value The value to check.
 */
function isValidGameUid(value: string): boolean {
    return /^[0-9A-Za-z]+$/.test(value);
}

/**
 * Checks if a value is a valid player UID.
 * @param value The value to check.
 */
function isValidPlayerUid(value: string): boolean {
    return /^[0-9A-Za-z]+$/.test(value);
}

/**
 * Checks if a value is a valid player role.
 * @param value The value to check.
 */
function isValidPlayerRole(value: string): boolean {
    return /^[A-Za-z]+$/.test(value);
}

// /**
//  * Checks if a value is a valid extension for a video or an audio file.
//  * @param value The value to check.
//  */
// function isValidMediaFileExt(value: string): boolean {

// }

// /**
//  *
//  * @param value The value to check.
//  */
// function isValidMimeContentType(value: string): boolean {

// }

export const ValidationUtils = {
    isValidGameUid,
    isValidPlayerUid,
    isValidPlayerRole,
};
