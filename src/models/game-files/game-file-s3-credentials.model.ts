import { ApiModelProperty } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains AWS S3 credentials.
 */
export class GameFileS3CredentialsModel {
    /**
     * S3 Access Key ID.
     */
    @ApiModelProperty({ readOnly: true, description: 'S3 Access Key ID.' })
    accessKeyId: string;

    /**
     *S3 Secret Access key.
     */
    @ApiModelProperty({ readOnly: true, description: 'S3 Secret Access key.' })
    secretAccessKey: string;

    /**
     * S3 Session Token.
     */
    @ApiModelProperty({ readOnly: true, description: 'S3 Session Token.' })
    sessionToken: string;

    /**
     * The time when the credentials expire.
     */
    @ApiModelProperty({ readOnly: true, description: 'The time when the credentials expire.', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    expiration: Date;
}