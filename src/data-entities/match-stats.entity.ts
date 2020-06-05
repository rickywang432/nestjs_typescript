import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { DbDataType } from './db-data-type';
import { GameEntity } from './game.entity';

@Entity('match_stats')
export class MatchStatsEntity {
  static metadata = {
    gameId: 'game_id',
    redTeamSoloKillsCount: 'rt_solo_kills_count',
    blueTeamSoloKillsCount: 'bt_solo_kills_count',
    redTeamIsoDeathsCount: 'rt_iso_deaths_count',
    blueTeamIsoDeathsCount: 'bt_iso_deaths_count',
    redTeamGoldDiffPre15: 'rt_gold_diff_pre15',
    blueTeamGoldDiffPre15: 'bt_gold_diff_pre15',
    redTeamGoldDiffPost15: 'rt_gold_diff_post15',
    blueTeamGoldDiffPost15: 'bt_gold_diff_post15',
    redTeamCsDiffPre15: 'rt_cs_diff_pre15',
    blueTeamCsDiffPre15: 'bt_cs_diff_pre15',
    redTeamCsDiffPost15: 'rt_cs_diff_post15',
    blueTeamCsDiffPost15: 'bt_cs_diff_post15',
    redTeamDragonSecurePercent: 'rt_dragon_secure_percent',
    blueTeamDragonSecurePercent: 'bt_dragon_secure_percent',
    redTeamBaronSecurePercent: 'rt_baron_secure_percent',
    blueTeamBaronSecurePercent: 'bt_baron_secure_percent',
  };

  /**
   * Game ID.
   */
  @PrimaryColumn(DbDataType.Int, { name: MatchStatsEntity.metadata.gameId })
  gameId: number;

  /**
   * Solo kills count of red team
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.redTeamSoloKillsCount,
  })
  redTeamSoloKillsCount: number;

  /**
   * Solo kills count of blue team
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.blueTeamSoloKillsCount,
  })
  blueTeamSoloKillsCount: number;

  /**
   * Isolated death count of red team
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.redTeamIsoDeathsCount,
  })
  redTeamIsolatedDeathsCount: number;

  /**
   * Isolated death count of blue team
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.blueTeamIsoDeathsCount,
  })
  blueTeamIsolatedDeathsCount: number;

  /**
   * Gold difference of red team within the first 15 mins
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.redTeamGoldDiffPre15,
  })
  redTeamGoldDiffPre15: number;

  /**
   * Gold difference of blue team within the first 15 mins
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.blueTeamGoldDiffPre15,
  })
  blueTeamGoldDiffPre15: number;

  /**
   * Gold difference of red team from the first 15 mins to the end
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.redTeamGoldDiffPost15,
  })
  redTeamGoldDiffPost15: number;

  /**
   * Gold difference of blue team from the first 15 mins to the end
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.blueTeamGoldDiffPost15,
  })
  blueTeamGoldDiffPost15: number;

  /**
   * Creep score difference of red team within the first 15 mins
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.redTeamCsDiffPre15,
  })
  redTeamCsDiffPre15: number;

  /**
   * Creep score difference of blue team within the first 15 mins
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.blueTeamCsDiffPre15,
  })
  blueTeamCsDiffPre15: number;

  /**
   * Creep score difference of red team from the first 15 mins to the end
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.redTeamCsDiffPost15,
  })
  redTeamCsDiffPost15: number;

  /**
   * Creep score difference of blue team from the first 15 mins to the end
   */
  @Column(DbDataType.Int, {
    name: MatchStatsEntity.metadata.blueTeamCsDiffPost15,
  })
  blueTeamCsDiffPost15: number;

  /**
   * Secured percent of dragon by red team
   */
  @Column(DbDataType.Float, {
    name: MatchStatsEntity.metadata.redTeamDragonSecurePercent,
  })
  redTeamDragonSecuredPercent: number;

  /**
   * Secured percent of dragon by blue team
   */
  @Column(DbDataType.Float, {
    name: MatchStatsEntity.metadata.blueTeamDragonSecurePercent,
  })
  blueTeamDragonSecuredPercent: number;

  /**
   * Secured percent of baron by red team
   */
  @Column(DbDataType.Float, {
    name: MatchStatsEntity.metadata.redTeamBaronSecurePercent,
  })
  redTeamBaronSecuredPercent: number;

  /**
   * Secured percent of baron by blue team
   */
  @Column(DbDataType.Float, {
    name: MatchStatsEntity.metadata.blueTeamBaronSecurePercent,
  })
  blueTeamBaronSecuredPercent: number;

  /**
   * Bi-directional One on one relation
   */
  @OneToOne(
    () => GameEntity,
    game => game.matchStats,
  )
  @JoinColumn({ name: MatchStatsEntity.metadata.gameId })
  game: GameEntity;
}
