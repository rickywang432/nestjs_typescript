import { Entity, PrimaryColumn } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about the follower of a player.
 */
@Entity('player_follower')
export class PlayerFollowerEntity {
    /**
     * Player ID.
     */
    @PrimaryColumn(DbDataType.Int, { name: 'player_id' })    
    playerId: number;

    /**
     * User ID.
     */
    @PrimaryColumn(DbDataType.Int, { name: 'user_id' })
    userId: number;
}