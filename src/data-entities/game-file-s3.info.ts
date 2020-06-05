/**
 * Contains AWS S3-related information of a game-related file.
 */
export class GameFileS3Info {
    /**
     * The key of the object on S3.
     */
    key: string;

    /**
     * The MIME content type (e.g. "video/mp4", "audio/ogg").
     */
    mimeContentType: string;

    /**
     * The extension of the file (e.g. ".mkv").
     */
    fileNameExtension: string;

    /**
     * The ID of the multipart upload.
     */
    multipartUploadId?: string | undefined;
}