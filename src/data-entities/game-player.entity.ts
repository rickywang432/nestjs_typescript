import { Entity, PrimaryColumn, Column } from 'typeorm';
import { DbDataType } from './db-data-type';
import { GameEntity } from './game.entity';
import { PlayerEntity } from './player.entity';
import { TeamEntity } from './team.entity';

/**
 * Contains information about a player in a game.
 */
@Entity('game_player')
export class GamePlayerEntity {
    static metadata = {
        gameId: 'game_id',
        summonerId: 'summoner_id',
        championId: 'champion_id',
        teamSide: 'team_side',
        teamId: 'team_id',
        teamMemberId: 'team_member_id',
        playerId: 'player_id',
        role: 'role',
    };

    /**
     * Game ID.
     */
    @PrimaryColumn(DbDataType.Int, { name: GamePlayerEntity.metadata.gameId })
    gameId: number;

    /**
     * Summoner ID (lower case).
     */
    @PrimaryColumn(DbDataType.BigInt, { name: GamePlayerEntity.metadata.summonerId })
    summonerId: number;

    /**
     * Champion ID (lower case).
     */
    @Column(DbDataType.Int, { name: GamePlayerEntity.metadata.championId })
    championId: number;

    /**
     * The side of the player's team.
     * @see {@link GameTeamSide}
     */
    @Column(DbDataType.TinyInt, { name: GamePlayerEntity.metadata.teamSide })
    teamSide: number;

    /**
     * The ID of the team (if any) the player is a member of.
     */
    @Column(DbDataType.Int, { name: GamePlayerEntity.metadata.teamId, nullable: true })
    teamId?: number | undefined;

    /**
     * The ID of the team member (if any) of the player.
     */
    @Column(DbDataType.Int, { name: GamePlayerEntity.metadata.teamMemberId, nullable: true })
    teamMemberId?: number | undefined;

    /**
     * The ID of the player.
     */
    @Column(DbDataType.Int, { name: GamePlayerEntity.metadata.playerId })
    playerId: number;

    /**
     * Role.
     */
    @Column(DbDataType.TinyInt, { name: GamePlayerEntity.metadata.role })
    role: number;

    /**
     * Game information. This is only used when joining tables
     */
    game: GameEntity;

    /**
     * Player information. This is only used when joining tables
     */
    player: PlayerEntity;

    /**
     * Team information. This is only used when joining tables
     */
    team: TeamEntity;
}
