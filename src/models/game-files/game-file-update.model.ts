import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, Matches, MaxLength, ValidateNested } from 'class-validator';
import { GameFileCompressionMethod } from './game-file-compression-method.enum';
import { GameFileFormat } from './game-file-format.enum';
import { GameFileMetadata } from './game-file-metadata';
import { Type } from 'class-transformer';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about an update of a game-related file.
 */
export class GameFileUpdateModel {
    /**
     * Format.
     */
    @ApiModelPropertyOptional({ description: 'Format.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsEnum(GameFileFormat)
    format?: GameFileFormat | undefined;

    /**
     * Compression type.
     */
    @ApiModelPropertyOptional({ description: 'Compression type.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsEnum(GameFileCompressionMethod)
    compressionMethod?: GameFileCompressionMethod | undefined;

    /**
     * Metadata.
     */
    @ApiModelPropertyOptional({ description: 'Metadata.', type: GameFileMetadata })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => GameFileMetadata)
    metadata?: GameFileMetadata | undefined;

    /**
     * The extension of the file (e.g. ".mkv", ".ogg", ".mp4").
     * CAUTION: The file extension is set only once when the file is created and cannot be updated afterwards.
     */
    @ApiModelProperty({ description: 'The extension of the file.' })
    @Matches(/^\.\w{1,5}$/) // TODO: Check against a list of know extensions
    fileNameExtension: string;

    /**
     * MIME content type.
     */
    @ApiModelProperty({ description: 'The MIME content type.' })
    // eslint-disable-next-line no-useless-escape
    @Matches(/^[\-\w\.]+\/[\-\w\.]+$/) // TODO: Check against a list of known content types
    @MaxLength(50)
    mimeContentType: string;
}
