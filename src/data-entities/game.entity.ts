import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToOne,
} from 'typeorm';
import { GameUploadTeamInfoModel, GameWardInfoModel } from '../models';
import { DbDataType } from './db-data-type';
import { MatchStatsEntity } from './match-stats.entity';

/**
 * Contains information about a team.
 */
@Entity('game')
@Unique(['uid'])
export class GameEntity {
  static metadata = {
    startTime: 'start_time_utc',
    endTime: 'end_time_utc',
    type: 'type',
    regionId: 'region_id',
    patchId: 'patch_id',
    redTeamId: 'red_team_id',
    blueTeamId: 'blue_team_id',
    winnerTeamSide: 'winner_team_side',
  };

  /**
   * ID.
   */
  @PrimaryGeneratedColumn('increment', { type: DbDataType.Int })
  id: number;

  /**
   * The ID of the user who updated the record for the last time.
   */
  @Column(DbDataType.Int, { name: 'update_user_id' })
  updateUserId: number;

  /**
   * The time when the record has been updated for the last time.
   */
  @Column(DbDataType.DateTime, { name: 'update_time_utc' })
  updateTime: Date;

  /**
   * Unique ID.
   */
  @Column(DbDataType.String, { name: 'uid' })
  uid: string;

  /**
   * Type.
   * @see {@link GameType}
   */
  @Column(DbDataType.TinyInt, { name: GameEntity.metadata.type })
  type: number;

  /**
   * Region ID.
   */
  @Column(DbDataType.String, { name: GameEntity.metadata.regionId })
  regionId: string;

  /**
   * Patch (LoL version).
   */
  @Column(DbDataType.String, { name: GameEntity.metadata.patchId })
  patchId: string;

  /**
   * The time when the game has started.
   */
  @Column(DbDataType.DateTime, { name: GameEntity.metadata.startTime })
  startTime: Date;

  /**
   * The time when the game has concluded.
   */
  @Column(DbDataType.DateTime, { name: GameEntity.metadata.endTime })
  endTime: Date;

  /**
   * Information about the red team.
   */
  @Column(DbDataType.JsonBinary, { name: 'red_team_info' })
  redTeamInfo: GameUploadTeamInfoModel;

  /**
   * Information about the blue team.
   */
  @Column(DbDataType.JsonBinary, { name: 'blue_team_info' })
  blueTeamInfo: GameUploadTeamInfoModel;

  /**
   * The side of the winner.
   * @see {@link GameTeamSide}
   */
  @Column(DbDataType.TinyInt, { name: GameEntity.metadata.winnerTeamSide })
  winnerTeamSide: number;

  /**
   * Wards information.
   */
  @Column(DbDataType.JsonBinary, { name: 'wards_info', nullable: true })
  wardsInfo: GameWardInfoModel | undefined;

  /**
   * The ID of the red team.
   */
  @Column(DbDataType.Int, {
    name: GameEntity.metadata.redTeamId,
    nullable: true,
  })
  redTeamId?: number | undefined;

  /**
   * The ID of the blue team.
   */
  @Column(DbDataType.Int, {
    name: GameEntity.metadata.blueTeamId,
    nullable: true,
  })
  blueTeamId?: number | undefined;

  /**
   * Bi-directional One on one relation
   */
  @OneToOne(
    () => MatchStatsEntity,
    matchStats => matchStats.game,
  )
  matchStats: MatchStatsEntity;
}
