import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsNumber, ValidateNested } from 'class-validator';

/**
 * Number of Tower Plates Taken by Role
 */
export class TeamTowerPlatesInfoStatsModel {
  /**
   * Top Role Taken
   */
  @ApiModelProperty()
  @IsNumber()
  topRoleTaken: number;

  /**
   * Jungler Role Taken
   */
  @ApiModelProperty()
  @IsNumber()
  junglerRoleTaken: number;

  /**
   * Middle Role Taken
   */
  @ApiModelProperty()
  @IsNumber()
  middleRoleTaken: number;

  /**
   * Bottom Role Taken
   */
  @ApiModelProperty()
  @IsNumber()
  bottomRoleTaken: number;

  /**
   * Support Role Taken
   */
  @ApiModelProperty()
  @IsNumber()
  supportRoleTaken: number;
}

/**
 * Number of Tower Plates Taken
 */
export class TeamTowerPlatesStatsModel {
  /**
   * Number of Tower Plates Taken : Top
   */
  @ApiModelProperty({ type: TeamTowerPlatesInfoStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamTowerPlatesInfoStatsModel)
  topTurret: TeamTowerPlatesInfoStatsModel;

  /**
   * Number of Tower Plates Taken : Top
   */
  @ApiModelProperty({ type: TeamTowerPlatesInfoStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamTowerPlatesInfoStatsModel)
  middleTurret: TeamTowerPlatesInfoStatsModel;

  /**
   * Number of Tower Plates Taken : Top
   */
  @ApiModelProperty({ type: TeamTowerPlatesInfoStatsModel })
  @IsObject()
  @ValidateNested()
  @Type(() => TeamTowerPlatesInfoStatsModel)
  bottomTurret: TeamTowerPlatesInfoStatsModel;
}
