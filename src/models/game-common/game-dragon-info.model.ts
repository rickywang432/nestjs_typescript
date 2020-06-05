import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { GameDragonEventInfoModel } from './game-dragon-event-info.model';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested, IsOptional } from 'class-validator';

/**
 * Contains information about the wards in a game.
 */
export class GameDragonInfoModel {
  /**
   * Cloud Dragon Stats.
   */
  @ApiModelPropertyOptional({
    description: 'Cloud Dragon stats',
    type: GameDragonEventInfoModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GameDragonEventInfoModel)
  cloudDragon?: GameDragonEventInfoModel | undefined;

  /**
   * Ocean Dragon Stats.
   */
  @ApiModelPropertyOptional({
    description: 'Ocean Dragon stats',
    type: GameDragonEventInfoModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GameDragonEventInfoModel)
  oceanDragon?: GameDragonEventInfoModel | undefined;

  /**
   * Infernal Dragon Stats.
   */
  @ApiModelPropertyOptional({
    description: 'Infernal Dragon stats',
    type: GameDragonEventInfoModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GameDragonEventInfoModel)
  infernalDragon?: GameDragonEventInfoModel | undefined;

  /**
   * Mountain Dragon Stats.
   */
  @ApiModelPropertyOptional({
    description: 'Mountain Dragon stats',
    type: GameDragonEventInfoModel,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GameDragonEventInfoModel)
  mountainDragon?: GameDragonEventInfoModel | undefined;
}
