import { GameTeamModel } from './game-team.model';
import { ApiModelProperty } from '@nestjs/swagger';
import { GameFileModel } from '../game-files';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameType, GameTeamSide } from '../game-common';

/**
 * Contains information about a game.
 */
export class GameModel {
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
    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: GameTeamModel })
    redTeam: GameTeamModel;

    /**
     * Blue team.
     */
    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: GameTeamModel })
    blueTeam: GameTeamModel;

    /**
     * Who is the winning team?
     */
    @ApiModelProperty({ readOnly: true, description: 'Who is the winning team?', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    winnerTeamSide: GameTeamSide;

    /**
     * Information about the replay file.
     */
    @ApiModelProperty({ readOnly: true, description: 'Information about the replay file.', type: GameFileModel })
    replayFile?: GameFileModel | undefined;

    /**
     * Information about the stats file.
     */
    @ApiModelProperty({ readOnly: true, description: 'Information about the stats file.', type: GameFileModel })
    statsFile?: GameFileModel | undefined;

    constructor(data?: {
        id: number;
        uid: string;
        gameStart: Date;
        gameEnd: Date;
        gameType: GameType;
        regionId: string;
        patchId: string;
        redTeam: GameTeamModel;
        blueTeam: GameTeamModel;
        winnerTeamSide: GameTeamSide;
        replayFile?: GameFileModel | undefined;
        statsFile?: GameFileModel | undefined;
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
            this.replayFile = data.replayFile;
            this.statsFile = data.statsFile;
        }
    }
}