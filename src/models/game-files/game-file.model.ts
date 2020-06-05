import { GameFileMetadata } from './game-file-metadata';
import { GameFileFormat } from './game-file-format.enum';
import { GameFileCompressionMethod } from './game-file-compression-method.enum';
import { GameFileType } from './game-file-type.enum';
import { GameFileUploadStatus } from './game-file-upload-status.enum';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about a game-related file.
 */
export class GameFileModel {
    /**
     * ID.
     */
    @ApiModelProperty({ readOnly: true, description: 'ID.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    id: number;

    /**
     * Type.
     */
    @ApiModelProperty({ readOnly: true, description: 'Type.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    type: GameFileType;

    /**
     * Format.
     */
    @ApiModelProperty({ readOnly: true, description: 'Format.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    format: GameFileFormat;

    /**
     * Compression type.
     */
    @ApiModelProperty({ readOnly: true, description: 'Compression type.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    compressionMethod: GameFileCompressionMethod;

    /**
     * Metadata.
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'Metadata', type: GameFileMetadata })
    metadata?: GameFileMetadata | undefined;

    /**
     * The status of the upload process.
     */
    @ApiModelProperty({ readOnly: true, description: 'The status of the upload process.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    uploadStatus: GameFileUploadStatus;

    constructor(data?: {
        id: number,
        type: GameFileType;
        format: GameFileFormat;
        compressionMethod: GameFileCompressionMethod;
        metadata?: GameFileMetadata | undefined;
        uploadStatus: GameFileUploadStatus;
    }) {
        if (data != undefined) {
            this.id = data.id;
            this.type = data.type;
            this.format = data.format;
            this.compressionMethod = data.compressionMethod;
            this.metadata = data.metadata;
            this.uploadStatus = data.uploadStatus;
        }
    }
}