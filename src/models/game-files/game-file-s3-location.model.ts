import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiType } from '../open-api-type';

/**
 * Contains information about the location of a game-related file on S3.
 */
export class GameFileS3LocationModel {
    /**
     * The name of the S3 bucket.
     */
    @ApiModelProperty({ readOnly: true, description: 'The name of the S3 bucket.' })
    bucketName: string;

    /**
     * The region of the S3 bucket (optional).
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'The region of the S3 bucket (optional).', type: OpenApiType.String })
    bucketRegion?: string | undefined;

    /**
     * Indicates if the S3 bucket supports acceleration.
     */
    @ApiModelProperty({ readOnly: true, description: 'Indicates if the S3 bucket supports acceleration.' })
    bucketIsAccelerated: boolean;

    /**
     * The key of the S3 object that contains the data.
     */
    @ApiModelProperty({ readOnly: true, description: 'The key of the S3 object that contains the data.' })
    key: string;
}