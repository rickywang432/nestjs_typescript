import { ApiModelProperty } from '@nestjs/swagger';
import { GameFileS3LocationModel } from './game-file-s3-location.model';
import { GameFileS3CredentialsModel } from './game-file-s3-credentials.model';

/**
 * Contains information that can be used to download a game-related file from S3.
 */
export class GameFileDownloadInfoModel {
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
     * The URL of the file.
     */
    @ApiModelProperty({ readOnly: true, description: 'The URL of the file.' })
    url: string;
}