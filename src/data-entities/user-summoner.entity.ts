import { Column, Entity, PrimaryColumn } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about the summoner used by a user.
 */
@Entity('user_summoner')
export class UserSummonerEntity {
    /**
     * User ID.
     */
    @PrimaryColumn(DbDataType.String, { name: 'user_id' })
    userId: number;

    /**
     * Summoner ID (lower case).
     */
    @PrimaryColumn(DbDataType.BigInt, { name: 'summoner_id' })
    summonerId: number;

    /**
     * The ID of the region the split belongs to.
     */
    @Column(DbDataType.String, { name: 'region_id' })
    regionId: string;
}