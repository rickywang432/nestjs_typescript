import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { PlayerProfileNestedModel, PlayerRole } from '../players';
import { GamePlayerLightModel } from './game-player-light.model';
import { PlayerMatchStatsModel } from './game-player-match-stats.model';
import { ChampionBuild } from '../game-common';
/**
 * Contains information about a player in a game.
 */
export class GamePlayerExtendedLightModel extends GamePlayerLightModel {

    /**
     * The general stats of the player in the team.
     */
    @ApiModelProperty({ readOnly: true, description: 'The general stats of the player in the team.', type: PlayerMatchStatsModel })
    general: PlayerMatchStatsModel;

    /**
     * The build of the champion.
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'The build of the champion.', type: ChampionBuild })
    championBuild: ChampionBuild | undefined;

    constructor(data?: {
        profile: PlayerProfileNestedModel;
        championId: number;
        role: PlayerRole;
        general: PlayerMatchStatsModel,
        championBuild: ChampionBuild | undefined;
    }) {
        super(data);
        if (data != undefined) {
            this.general = data.general;
            this.championBuild = data.championBuild;
        }
    }
}