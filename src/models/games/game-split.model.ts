import { ApiModelProperty } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about a split.
 */
export class GameSplitModel {
    /**
     * Name.
     */
    @ApiModelProperty({ readOnly: true, description: 'Name.' })
    name: string;

    /**
     * The ID of the region the split belongs to (e.g. "na1").
     */
    @ApiModelProperty({ readOnly: true, description: 'The ID of the region the split belongs to (e.g. "na1").' })
    regionId: string;

    /**
     * The time when the split starts.
     */
    @ApiModelProperty({ readOnly: true, description: 'The time when the split starts.', type: OpenApiType.String, format: OpenApiFormat.Date })
    startTime: Date;

    /**
     * The time when the split ends.
     */
    @ApiModelProperty({ readOnly: true, description: 'The time when the split ends.', type: OpenApiType.String, format: OpenApiFormat.Date })
    endTime: Date;

    /**
     * Indicates if the split is still in use.
     */
    @ApiModelProperty({ readOnly: true, description: 'Indicates if the split is still in use.' })
    isActive: boolean;

    constructor(data: {
        name: string;
        regionId: string;
        startTime: Date;
        endTime: Date;
        isActive: boolean;
    }) {
        if (data != undefined) {
            this.name = data.name;
            this.regionId = data.regionId;
            this.startTime = data.startTime;
            this.endTime = data.endTime;
            this.isActive = data.isActive;
        }
    }
}