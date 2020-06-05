// import { GamePlayerModel } from "./game-player.model";
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { GamePlayerExtendedLightModel } from './game-player-extended-light.model';
import { TeamProfileNestedModel } from '../teams';

/**
 * Contains information about a team in a game.
 */
export class GameTeamLightModel {
    /**
     * Profile (if the team is known).
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'Profile.', type: TeamProfileNestedModel })
    profile?: TeamProfileNestedModel | undefined;

    /**
     * Players.
     */
    @ApiModelProperty({ readOnly: true, description: 'Players.', type: GamePlayerExtendedLightModel, isArray: true })
    players: GamePlayerExtendedLightModel[];
    
    constructor(data?: {
        profile?: TeamProfileNestedModel | undefined;
        players: GamePlayerExtendedLightModel[];
    }) {
        if (data != undefined) {
            this.profile = data.profile;
            this.players = data.players;
        }
    }
}