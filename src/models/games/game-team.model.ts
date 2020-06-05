import { GamePlayerModel } from './game-player.model';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { TeamProfileNestedModel } from '../teams';

/**
 * Contains information about a team ina game.
 */
export class GameTeamModel {
    /**
     * Profile (if the team is known).
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'Profile.', type: TeamProfileNestedModel })
    profile?: TeamProfileNestedModel | undefined;

    /**
     * Players.
     */
    @ApiModelProperty({ readOnly: true, description: 'Players.', type: GamePlayerModel, isArray: true })
    players: GamePlayerModel[];
}