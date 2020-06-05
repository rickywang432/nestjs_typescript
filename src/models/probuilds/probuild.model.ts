import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { PlayerRole } from '../players';
import { ChampionBuildPathModel, ChampionSkillModel, GameTeamSide, GameType } from '../game-common';

export class ProbuildPlayerModel {
    @ApiModelProperty({ readOnly: true, description: 'The ID of the player\'s champion.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    championId: number;

    @ApiModelProperty({ readOnly: true, description: 'The role of the player during the game.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    role: PlayerRole;

    @ApiModelProperty({ readOnly: true, description: 'Summoner name of the player', type: OpenApiType.String })
    summonerName: string;
}

export class ProbuildTeamModel {
    @ApiModelPropertyOptional({ readOnly: true, description: 'The ID of the team', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    id: number | undefined;

    @ApiModelProperty({ readOnly: true, description: 'Team side - Red or Blue', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    side: GameTeamSide;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Logo URL of the team', type: OpenApiType.String })
    logoURL: string | undefined;

    @ApiModelProperty({ readOnly: true, description: 'List of players in the team', type: ProbuildPlayerModel, isArray: true })
    players: ProbuildPlayerModel[];
}

export class ProbuildModel {
    @ApiModelProperty({ readOnly: true, description: 'The ID of the game.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    gameId: number;

    @ApiModelProperty({ readOnly: true, description: 'The ID of the player.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    playerId: number;

    @ApiModelProperty({ readOnly: true, description: 'Summoner name of the player', type: OpenApiType.String })
    summonerName: string;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Picture URL of the player', type: OpenApiType.String })
    proPictureURL: string | undefined;

    @ApiModelProperty({ readOnly: true, description: 'The ID of the player\'s champion.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    championId: number;

    @ApiModelProperty({ readOnly: true, description: 'The ID of the opponent player\'s champion.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    opponentChampionId: number;

    @ApiModelProperty({ readOnly: true, description: 'The role of the player during the game.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    role: PlayerRole;

    @ApiModelProperty({ readOnly: true, description: 'Ally team', type: ProbuildTeamModel })
    team: ProbuildTeamModel;

    @ApiModelProperty({ readOnly: true, description: 'Opponent team', type: ProbuildTeamModel })
    opponentTeam: ProbuildTeamModel;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Rune shards', type: OpenApiType.Integer, format: OpenApiFormat.Int32, isArray: true })
    runeShards: number[] | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Rune primary tree', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    runePrimaryTree: number | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Rune secondary tree', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    runeSecondaryTree: number | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Skill order', type: ChampionSkillModel, isArray: true })
    skillOrder: ChampionSkillModel[] | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Spells.', type: OpenApiType.Integer, format: OpenApiFormat.Int32, isArray: true })
    spells: number[] | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Build paths', type: ChampionBuildPathModel, isArray: true })
    buildPaths: ChampionBuildPathModel[] | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Starting Items', type: OpenApiType.Integer, isArray: true })
    startingItems: number[] | undefined;

    @ApiModelPropertyOptional({ readOnly: true, description: 'Final Builds', type: OpenApiType.Integer, isArray: true })
    finalBuilds: number[] | undefined;

    @ApiModelProperty({ readOnly: true, description: 'The time when the game started.', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    startTime: Date;

    @ApiModelProperty({ readOnly: true, description: 'The time when the game ended.', type: OpenApiType.String, format: OpenApiFormat.DateTime })
    endTime: Date;

    @ApiModelProperty({ readOnly: true, description: 'Patch of the LoL client when this game was played', type: OpenApiType.String })
    patch: string;

    @ApiModelProperty({ readOnly: true, description: 'Game type - scrim, tournament or solo queue', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    type: GameType;
}
