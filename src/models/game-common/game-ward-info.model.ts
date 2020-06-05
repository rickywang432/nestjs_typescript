import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { GameWardEventInfoModel } from './game-ward-event-info.model';
import { Type } from 'class-transformer';

/**
 * Contains information about the wards in a game.
 */
export class GameWardInfoModel {
    /**
     * Ward events.
     */
    @ApiModelPropertyOptional({ description: 'Ward events.', type: GameWardEventInfoModel, isArray: true })
    @IsArray()
    @ValidateNested()
    @ArrayMaxSize(1000)
    @Type(() => GameWardEventInfoModel)
    events: GameWardEventInfoModel[] | undefined;
}
