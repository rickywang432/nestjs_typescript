import { ApiModelProperty } from '@nestjs/swagger';
import { GameFileModel } from '../game-files';
import { PlayerProfileNestedModel, PlayerRole } from '../players';
import { OpenApiType, OpenApiFormat } from '../open-api-type';

/**
 * Contains information about a player in a game.
 */
export class GamePlayerModel {
  /**
   * Profile.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Profile.',
    type: PlayerProfileNestedModel,
  })
  profile: PlayerProfileNestedModel;

  /**
   * The ID of the player's champion.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The ID of the player\'s champion.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  championId: number;

  /**
   * The role of the player in the team.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'The role of the player in the team.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  role: PlayerRole;

  /**
   * Information about the replay file.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information about the replay file.',
    type: GameFileModel,
  })
  videoFile?: GameFileModel | undefined;

  /**
   * Information about the stats file.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'Information about the stats file.',
    type: GameFileModel,
  })
  audioFile?: GameFileModel | undefined;

  constructor(data?: {
    profile: PlayerProfileNestedModel;
    championId: number;
    role: PlayerRole;
    videoFile?: GameFileModel | undefined;
    audioFile?: GameFileModel | undefined;
  }) {
    if (data != undefined) {
      this.profile = data.profile;
      this.championId = data.championId;
      this.role = data.role;
      this.videoFile = data.videoFile;
      this.audioFile = data.audioFile;
    }
  }
}
