import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains additional information 
 */
export class GameFileMetadata {
    /**
     * The time when the recording has started (e.g. for video and audio files).
     */
    @ApiModelPropertyOptional({ description: 'The time when the recording has started (e.g. for video and audio files).', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    @IsOptional()
    @IsDate()
    @Type(() => Date) // Convert string to Date during deserialization
    recordingStartTime?: Date | undefined;

    /**
     * The time when the recording has ended (e.g. for video and audio files).
     */
    @ApiModelPropertyOptional({ description: 'The time when the recording has ended (e.g. for video and audio files).', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    @IsOptional()
    @IsDate()
    @Type(() => Date) // Convert string to Date during deserialization    
    recordingEndTime?: Date | undefined;

    /**
     * @summary The difference it time from the beginning of the recording and the beginning of the game.
     * @description
     * The value is positive if the recording has started before the beginning of the game and negative if
     * the recording has started after the beginning of the game.
     */
    @ApiModelPropertyOptional({ description: 'The difference it time from the beginning of the recording and the beginning of the game.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsInt()
    recordingOffsetSeconds?: number | undefined;

    /**
     * The length of the recording (e.g. for video and audio files).
     */
    @ApiModelPropertyOptional({ description: 'The length of the recording (e.g. for video and audio files).', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsInt()
    @Min(0)
    recordingLengthSeconds?: number | undefined;
}