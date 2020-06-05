import { ApiModelProperty } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { PlayerRole } from '../players';

export class MatchupStatsModel {
  /**
   * The ID of the mathup champion.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The ID of the champion.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  championId: number;

  /**
   * Win Rate
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Win Rate.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  winRate: number;

  constructor(data?: { championId: number; winRate: number }) {
    if (data != undefined) {
      this.championId = data.championId;
      this.winRate = data.winRate;
    }
  }
}
/**
 * Contains information about the champions of the team
 */
export class TeamChampionsStatsModel {
  /**
   * The role of the player during the game.
   */
  @ApiModelProperty({
    description: 'The role of the player',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  roleId: PlayerRole;

  /**
   * The ID of the player's champion.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The ID of the champion.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  championId: number;

  /**
   * Win Rate
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Win Rate.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  winRate: number;

  /**
   * Banned By
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Banned By',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  bannedByRate: number;

  /**
   * Banned Against
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Banned Against.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  bannedAgainstRate: number;

  /**
   * Pick Rate
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Pick Rate.',
    type: OpenApiType.Number,
    format: OpenApiFormat.Double,
  })
  pickRate: number;

  /**
   * Matchups
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Matchups.',
    type: MatchupStatsModel,
    format: OpenApiFormat.Int32,
  })
  matchups: MatchupStatsModel[];

  /**
   * Matches.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Matches.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameCount: number;

  constructor(data?: {
    roleId: PlayerRole;
    championId: number;
    winRate: number;
    bannedByRate: number;
    bannedAgainstRate: number;
    pickRate: number;
    matchups: MatchupStatsModel[];
    matchesCount: number;
  }) {
    if (data != undefined) {
      this.roleId = data.roleId;
      this.championId = data.championId;
      this.winRate = data.winRate;
      this.bannedByRate = data.bannedByRate;
      this.bannedAgainstRate = data.bannedAgainstRate;
      this.pickRate = data.pickRate;
      this.matchups = data.matchups;
      this.gameCount = data.matchesCount;
    }
  }
}
