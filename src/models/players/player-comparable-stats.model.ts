import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { PlayerStatsModel } from './player-stats.model';

export class PlayerComparableStatsModel {
  /**
   * The primary player stats.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The primary plaery\'s stats.',
    type: PlayerStatsModel,
  })
  primaryPlayerStats: PlayerStatsModel;

  /**
   * The secondary player stats (ex. vsPlayer or comparePlayer)
   */
  @ApiModelPropertyOptional({
    readOnly: true,
    description: 'The secondary player stats',
    type: PlayerStatsModel,
  })
  secondaryPlayerStats?: PlayerStatsModel | undefined;

  constructor(data?: {
    primaryPlayerStats: PlayerStatsModel;
    secondaryPlayerStats?: PlayerStatsModel | undefined;
  }) {
    if (data) {
      this.primaryPlayerStats = data.primaryPlayerStats;
      if (data.secondaryPlayerStats) {
        this.secondaryPlayerStats = data.secondaryPlayerStats;
      }
    }
  }
}
