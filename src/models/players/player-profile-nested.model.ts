import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about a user.
 */
export class PlayerProfileNestedModel {
    /**
     * ID.
     */
    @ApiModelProperty({ readOnly: true, description: 'ID.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    id: number;

    /**
     * Name.
     */
    @ApiModelProperty({ readOnly: true, description: 'Name.' })
    name: string;

    /**
     * The URL of the player's picture.
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'The URL of the player\'s picture.', type: OpenApiType.String })
    pictureUrl?: string | undefined;

    constructor(data?: {
        id: number;
        name: string;
        pictureUrl?: string | undefined;
    }) {
        if (data != undefined) {
            this.id = data.id;
            this.name = data.name;
            this.pictureUrl = data.pictureUrl;
        }
    }
}