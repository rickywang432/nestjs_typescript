import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about a player.
 * @description
 * CAUTION: It is possible that a player moves to another team and their name changes, however, their ID remain the same.
 * Therefore, in order to keep the name of the player consistent with their new team (e.g. "TSM John" to "LLP John") as well as
 * to keep the link between the player and the corresponding "TeamMember" record a new "Player" record must be created.
 */
@Entity('player')
export class PlayerEntity {
    /**
     * ID.
     */
    @PrimaryGeneratedColumn('increment', { type: DbDataType.Int })
    id: number;

    /**
     * Name (unique).
     */
    @Column(DbDataType.String, { name: 'name' })
    name: string;

    /**
     * Name ID (unique, lower case).
     */
    @Column(DbDataType.String, { name: 'name_id' })
    nameId: string;

    // /**
    //  * Summoner ID (lower case).
    //  */
    // @Column(DbDataType.BigInt, { name: 'summoner_id' })
    // summonerId: number;

    /**
     * Summoner name.
     */
    @Column(DbDataType.String, { name: 'summoner_name' })
    summonerName: string;

    // /**
    //  * Summoner internal name.
    //  */
    // @Column(DbDataType.String, { name: 'summoner_internal_name' })
    // summonerInternalName: string;

    /**
     * Picture URL.
     */
    @Column(DbDataType.String, { name: 'picture_url', nullable: true })
    pictureUrl?: string | undefined;

    // /**
    //  * The ID of the team (if any) the player is a member of.
    //  */
    // @Column(DbDataType.Int, { name: 'team_id', nullable: true })
    // teamId?: number | undefined;

    // /**
    //  * The ID of the team member (if any) of the player.
    //  */
    // @Column(DbDataType.Int, { name: 'team_member_id', nullable: true })
    // teamMemberId?: number | undefined;
}
