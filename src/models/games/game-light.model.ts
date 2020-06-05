import { ApiModelProperty } from '@nestjs/swagger';
import { GameTeamLightModel } from './game-team-light.model';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameType, GameTeamSide } from '../game-common';

/**
 * Contains information about a game.
 */
export class GameLightModel {
    /**
     * ID.
     */
    @ApiModelProperty({ readOnly: true, description: 'ID.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    id: number;

    /**
     * Unique ID.
     */
    @ApiModelProperty({ readOnly: true, description: 'Unique ID.' })
    uid: string;

    /**
     * The time the game has started.
     */
    @ApiModelProperty({ readOnly: true, description: 'The time the game has started.', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    gameStart: Date;

    /**
     * The time the game has concluded.
     */
    @ApiModelProperty({ readOnly: true, description: 'The time the game has started.', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    gameEnd: Date;

    /**
     * Type.
     */
    @ApiModelProperty({ readOnly: true, description: 'Type.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    gameType: GameType;

    /**
     * Region ID (e.g. "na1").
     */
    @ApiModelProperty({ readOnly: true, description: 'Region ID (e.g. "na1").' })
    regionId: string;

    /**
     * LoL game software patch (e.g. "10.1");
     */
    @ApiModelProperty({ readOnly: true, description: 'LoL game software patch (e.g. "10.1");' })
    patchId: string;

    /**
     * Red team.
     */
    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: GameTeamLightModel })
    redTeam: GameTeamLightModel;

    /**
     * Blue team.
     */
    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: GameTeamLightModel })
    blueTeam: GameTeamLightModel;

    /**
     * Who is the winning team?
     */
    @ApiModelProperty({ readOnly: true, description: 'Who is the winning team?', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    winnerTeamSide: GameTeamSide;

    constructor(data?: {
        id: number;
        uid: string;
        gameStart: Date;
        gameEnd: Date;
        gameType: GameType;
        regionId: string;
        patchId: string;
        redTeam: GameTeamLightModel;
        blueTeam: GameTeamLightModel;
        winnerTeamSide: GameTeamSide;
    }) {
        if (data != undefined) {
            this.id = data.id;
            this.uid = data.uid;
            this.gameStart = data.gameStart;
            this.gameEnd = data.gameEnd;
            this.gameType = data.gameType;
            this.regionId = data.regionId;
            this.patchId = data.patchId;
            this.redTeam = data.redTeam;
            this.blueTeam = data.blueTeam;
            this.winnerTeamSide = data.winnerTeamSide;
        }
    }
}