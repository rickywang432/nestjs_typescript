import { TeamObjectivesStatsModel, LaneInteractionInfoModel, TeamTowerPlatesStatsModel } from '../teams';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

/**
 * Contains statistics about a team.
 */
export class GameUploadTeamStatsModel {
  /**
   * Objectives.
   */
  @ApiModelProperty({ type: TeamObjectivesStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamObjectivesStatsModel)
  objectives: TeamObjectivesStatsModel;

  /**
   * Lane Interaction.
   */
  @ApiModelProperty({ type: LaneInteractionInfoModel })
  @IsObject()
  @ValidateNested()
  @Type(() => LaneInteractionInfoModel)
  laneInteraction: LaneInteractionInfoModel;

  /**
   * Average Number of Tower Plates Taken.
   */
  @ApiModelProperty({ type: TeamTowerPlatesStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamTowerPlatesStatsModel)
  towerPlates: TeamTowerPlatesStatsModel;
}
