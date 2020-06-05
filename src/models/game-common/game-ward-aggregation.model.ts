import { GameWardEventInfoModel } from './game-ward-event-info.model'
import { ApiModelProperty } from '@nestjs/swagger'
import { OpenApiType, OpenApiFormat } from '../open-api-type'
import { Min, Max, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Contains information about a ward aggregation.
 */
export class GameWardAggregationModel {
    /**
     * Percent value of a ward to indicate how often a ward placed in a certain position.
     */
    @ApiModelProperty({
        description: 'Percent value of a ward to indicate how often a ward placed in a certain position',
        type: OpenApiType.Number,
        format: OpenApiFormat.Double,
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    percent: number;

    /**
     * Ward Event
     */
    @ApiModelProperty({
        description: 'Ward Event',
        type: GameWardEventInfoModel,
    })
    @IsObject()
    @ValidateNested()
    @Type(() => GameWardEventInfoModel)
    wardEvent: GameWardEventInfoModel;

    constructor(wardEvent: GameWardEventInfoModel, percent: number) {
        this.wardEvent = wardEvent;
        this.percent = percent;
    }
}