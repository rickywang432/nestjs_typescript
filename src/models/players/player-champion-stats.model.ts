import { ApiModelProperty } from '@nestjs/swagger';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { PlayerAnyGamePeriodStatsModel } from './player-stats.shared';
import { PlayerRole } from './player-role.enum';
/**
 * Contains stats of a champion when used by a particular player.
 */
export class PlayerChampionStatsModel {
  /**
   * Champion ID.
   */
  @ApiModelProperty({
    readOnly: true,
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  championId: number;

  @ApiModelProperty({
    readOnly: true,
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  role: PlayerRole;


  /**
   * The number of games the champion was used in.
   */
  @ApiModelProperty({
    readOnly: true,
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  gameCount: number;

  /**
   * The number of games the champion was used in and lead to win the game.
   */
  @ApiModelProperty({
    readOnly: true,
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  winGameCount: number;

  /**
   * The average number of kills.
   */
  @ApiModelProperty({ readOnly: true })
  avgKillCount: number;

  /**
   * The average number of deaths.
   */
  @ApiModelProperty({ readOnly: true })
  avgDeathCount: number;

  /**
   * The average number of assists.
   */
  @ApiModelProperty({ readOnly: true })
  avgAssistCount: number;

  /**
   * The average kill-to-death ratio.
   * @see https://leagueoflegends.fandom.com/wiki/Kill_to_Death_Ratio
   */
  //   get avgKillToDeathRatio(): number | undefined {
  //     if (
  //       this.avgKillCount != undefined &&
  //       this.avgKillToDeathRatio != undefined &&
  //       this.avgKillToDeathRatio > 0
  //     ) {
  //       return this.avgKillCount / this.avgKillToDeathRatio;
  //     } else {
  //       return undefined;
  //     }
  //   }

  /**
   * Average forward %.
   */
  @ApiModelProperty({ readOnly: true, type: PlayerAnyGamePeriodStatsModel })
  avgForwardPercent: PlayerAnyGamePeriodStatsModel;

  @ApiModelProperty({ readOnly: true })
  avgDmgPercent: number;

  /**
   * The average amount of gold per minute.
   */
  @ApiModelProperty({ readOnly: true })
  avgGPM: number;

  /**
   * Avg Creep Score difference.
   */
  @ApiModelProperty({ readOnly: true, type: PlayerAnyGamePeriodStatsModel })
  avgCreepScoreDifferenceCount: PlayerAnyGamePeriodStatsModel;

  /**
   * Avg gold difference.
   */
  @ApiModelProperty({ readOnly: true, type: PlayerAnyGamePeriodStatsModel })
  avgGoldDifferenceCount: PlayerAnyGamePeriodStatsModel;

  constructor(data?: {
    championId: number;
    role: PlayerRole;
    gameCount: number;
    winGameCount: number;
    avgKillCount: number;
    avgDeathCount: number;
    avgAssistCount: number;
    avgForwardPercent: PlayerAnyGamePeriodStatsModel;
    avgDmgPercent: number;
    avgGPM: number;
    avgCreepScoreDifferenceCount: PlayerAnyGamePeriodStatsModel;
    avgGoldDifferenceCount: PlayerAnyGamePeriodStatsModel;
  }) {
    if (data != undefined) {
      this.championId = data.championId;
      this.role = data.role;
      this.gameCount = data.gameCount;
      this.winGameCount = data.winGameCount;
      this.avgKillCount = data.avgKillCount;
      this.avgDeathCount = data.avgDeathCount;
      this.avgAssistCount = data.avgAssistCount;
      this.avgForwardPercent = data.avgForwardPercent;
      this.avgDmgPercent = data.avgDmgPercent;
      this.avgGPM = data.avgGPM;
      this.avgCreepScoreDifferenceCount = data.avgCreepScoreDifferenceCount;
      this.avgGoldDifferenceCount = data.avgGoldDifferenceCount;
    }
  }

  average(): PlayerChampionStatsModel {
    this.avgKillCount /= this.gameCount;
    this.avgDeathCount /= this.gameCount;
    this.avgAssistCount /= this.gameCount;
    this.avgForwardPercent.min15 /= this.gameCount;
    this.avgForwardPercent.min10 /= this.gameCount;
    this.avgDmgPercent /= this.gameCount;
    this.avgGPM /= this.gameCount;
    this.avgCreepScoreDifferenceCount.min15 /= this.gameCount;
    this.avgCreepScoreDifferenceCount.min10 /= this.gameCount;
    this.avgGoldDifferenceCount.min15 /= this.gameCount;
    this.avgGoldDifferenceCount.min10 /= this.gameCount;
    return this;
  }

  add(x: PlayerChampionStatsModel) {
    this.gameCount += x.gameCount;
    this.winGameCount += x.winGameCount;
    this.avgKillCount += x.avgKillCount;
    this.avgDeathCount += x.avgDeathCount;
    this.avgAssistCount += x.avgAssistCount;
    this.avgForwardPercent.min15 += x.avgForwardPercent.min15;
    this.avgForwardPercent.min10 += x.avgForwardPercent.min10;
    this.avgDmgPercent += x.avgDmgPercent;
    this.avgGPM += x.avgGPM;
    this.avgCreepScoreDifferenceCount.min15 += x.avgCreepScoreDifferenceCount.min15;
    this.avgCreepScoreDifferenceCount.min10 += x.avgCreepScoreDifferenceCount.min10;
    this.avgGoldDifferenceCount.min15 += x.avgGoldDifferenceCount.min15;
    this.avgGoldDifferenceCount.min10 += x.avgGoldDifferenceCount.min10;
    return this;
  }
}
