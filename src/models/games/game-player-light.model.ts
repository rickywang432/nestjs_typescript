import { ApiModelProperty } from '@nestjs/swagger';
import { PlayerProfileNestedModel, PlayerRole } from '../players';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about a player in a game.
 */
export class GamePlayerLightModel {
    /**
     * Profile.
     */
    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: PlayerProfileNestedModel })
    profile: PlayerProfileNestedModel;

    /**
     * The ID of the player's champion.
     */
    @ApiModelProperty({ readOnly: true, description: 'The ID of the player\'s champion.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    championId: number;

    /**
     * The role of the player in the team.
     */
    @ApiModelProperty({ readOnly: true, description: 'The role of the player in the team.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    role: PlayerRole;

    constructor(data?: {
        profile: PlayerProfileNestedModel;
        championId: number;
        role: PlayerRole;
    }) {
        if (data != undefined) {
            this.profile = data.profile;
            this.championId = data.championId;
            this.role = data.role;
        }
    }
}