import { ApiModelProperty } from '@nestjs/swagger';

/**
 * Contains information about a patch.
 */
export class GamePatchModel {
    /**
     * Name.
     */
    @ApiModelProperty({ readOnly: true, description: 'Name.' })
    name: string;

    /**
     * Indicates if the patch is still in use.
     */
    @ApiModelProperty({ readOnly: true, description: 'Indicates if the patch is still in use.' })
    isActive: boolean;

    constructor(data: {
        name: string;
        isActive: boolean;
    }) {
        if (data != undefined) {
            this.name = data.name;
            this.isActive = data.isActive;
        }
    }    
}