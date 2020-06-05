import { Entity, PrimaryColumn, Column } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about video or audio uploaded for a game.
 */
@Entity('game_banned_champion')
export class GameBannedChampionEntity {
  /**
   * Game ID.
   */
  @PrimaryColumn(DbDataType.Int, { name: 'game_id' })
  gameId: number;

  /**
   * Champion ID.
   */
  @PrimaryColumn(DbDataType.Int, { name: 'champion_id' })
  championId: number;
  /**
   * The side of the team who banned the champion.
   * @see {@link GameTeamSide}
   */
  @PrimaryColumn(DbDataType.TinyInt, { name: 'team_side' })
  teamSide: number;

  /**
   * The ID of the team who banned the champion.
   */
  @Column(DbDataType.Int, { name: 'team_id', nullable: true })
  teamId?: number | undefined;
}
