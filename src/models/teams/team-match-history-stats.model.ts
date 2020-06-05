import { ApiModelProperty } from '@nestjs/swagger';
import { GameType, GameTeamSide } from '../game-common';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

import { Type } from 'class-transformer';

/**
 * Contains information about a record of match history stats between two teams
 */
export class TeamMatchHistoryStatsModel {
  /**
   * The GameEntity ID
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'GameEntity ID',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameId: number;

  /**
   * The game ID in RIOT
   */
  @ApiModelProperty({ readOnly: true, description: 'Unique ID.' })
  gameUid: string;

  /**
   * Team side of the requested team in the game.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Team side of the requested team in the game.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameTeamSide: GameTeamSide;

  /**
   * The enemy team ID
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The enemy team ID',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  enemyTeamId: number;

  /**
   * The enemy team name
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The enemy team name',
  })
  enemyTeamName: string;

  /**
   * Solo Kills.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Solo Kills.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  soloKillsCount: number;

  /**
   * Isolated Deaths.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Solo Kills.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  isoDeathsCount: number;

  /**
   * Gold Diff Pre-15.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Gold Diff Pre-15.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  goldDiffPre15: number;

  /**
   * Gold Diff Post-15.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Gold Diff Post-15.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  goldDiffPost15: number;

  /**
   * Gold Diff Pre-15.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'CS Diff Pre-15.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  csDiffPre15: number;

  /**
   * Gold Diff Post-15.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'CS Diff Post-15.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  csDiffPost15: number;

  /**
   * Dragons.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Dragons.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  dragonSecuredPercent: number;

  /**
   * Dragons.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Baron.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  baronSecuredPercent: number;

  /**
   * Game Duration.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Game Duration.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameDurationSeconds: number;

  /**
   * Type.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Type.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameType: GameType;

  /**
   * The time the game has started.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The time the game has started.',
    type: OpenApiType.String,
    format: OpenApiFormat.DateTime,
  })
  @Type(() => Date) // Convert string to Date during deserialization
  gameStartTime: Date;

  /**
   * LoL game software patch (e.g. "10.1");
   */
  @ApiModelProperty({
    description: 'LoL game software patch (e.g. "10.1");',
  })
  gamePatch: string;

  constructor(data?: {
    gameId: number;
    gameUid: string;
    gameTeamSide: GameTeamSide;
    enemyTeamId: number;
    enemyTeamName: string;
    soloKillsCount: number;
    isoDeathsCount: number;
    goldDiffPre15: number;
    goldDiffPost15: number;
    csDiffPre15: number;
    csDiffPost15: number;
    dragonSecuredPercent: number;
    baronSecuredPercent: number;
    gameDurationSeconds: number;
    gameType: GameType;
    gameStartTime: Date;
    gamePatch: string;
  }) {
    if (data != undefined) {
      this.gameId = data.gameId;
      this.gameUid = data.gameUid;
      this.gameTeamSide = data.gameTeamSide;
      this.enemyTeamId = data.enemyTeamId;
      this.enemyTeamName = data.enemyTeamName;
      this.soloKillsCount = data.soloKillsCount;
      this.isoDeathsCount = data.isoDeathsCount;
      this.goldDiffPre15 = data.goldDiffPre15;
      this.goldDiffPost15 = data.goldDiffPost15;
      this.csDiffPre15 = data.csDiffPre15;
      this.csDiffPost15 = data.csDiffPost15;
      this.dragonSecuredPercent = data.dragonSecuredPercent;
      this.baronSecuredPercent = data.baronSecuredPercent;
      this.gameDurationSeconds = data.gameDurationSeconds;
      this.gameType = data.gameType;
      this.gameStartTime = data.gameStartTime;
      this.gamePatch = data.gamePatch;
    }
  }
}
