import { ApiModelProperty } from '@nestjs/swagger';
import { GameFileS3CredentialsModel } from './game-file-s3-credentials.model';
import { GameFileS3LocationModel } from './game-file-s3-location.model';

/**
 * Contains information that can be used to upload a game-related file to S3.
 */
export class GameFileUploadInfoModel {
    /**
     * AWS S3 credentials.
     */
    @ApiModelProperty({ readOnly: true, description: 'AWS S3 credentials.', type: GameFileS3CredentialsModel })
    s3Credentials: GameFileS3CredentialsModel;

    /**
     * The location of the file on AWS S3.
     */
    @ApiModelProperty({ readOnly: true, description: 'The location of the file on AWS S3.', type: GameFileS3LocationModel })
    s3Location: GameFileS3LocationModel;

    /**
     * The ID of the multipart upload.
     */
    @ApiModelProperty({ readOnly: true, description: 'The ID of the multipart upload.' })
    s3MultipartUploadId: string;
}
