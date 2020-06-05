import { GameTeamModel } from './game-team.model';
import { ApiModelProperty } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameTeamSide } from '../game-common';
import { GameUploadTeamInfoModel } from '../game-upload';

/**
 * Contains information about a game.
 */
export class GameStatsResponseModel {


    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: GameTeamModel })
    redTeam: GameUploadTeamInfoModel;

    /**
     * Blue team.
     */
    @ApiModelProperty({ readOnly: true, description: 'Profile.', type: GameTeamModel })
    blueTeam: GameUploadTeamInfoModel;

    /**
     * Who is the winning team?
     */
    @ApiModelProperty({ readOnly: true, description: 'Who is the winning team?', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    winnerTeamSide: GameTeamSide;

    constructor(data?: {
        redTeam: GameUploadTeamInfoModel;
        blueTeam: GameUploadTeamInfoModel;
        winnerTeamSide: GameTeamSide;
    }) {
        if (data != undefined) {
            this.redTeam = data.redTeam;
            this.blueTeam = data.blueTeam;
            this.winnerTeamSide = data.winnerTeamSide;
        }
    }
}