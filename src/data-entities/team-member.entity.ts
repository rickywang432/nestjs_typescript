import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about a team member.
 */
@Entity('team_member')
// @Unique(['name'])
// @Unique(['nameId'])
export class TeamMemberEntity {
    /**
     * ID.
     */
    @PrimaryGeneratedColumn('increment', { type: DbDataType.Int })
    id: number;

    /**
     * Team ID.
     */
    @Column(DbDataType.Int, { name: 'team_id' })
    teamId: number;

    /**
     * Role.
     */
    @Column(DbDataType.TinyInt, { name: 'role' })
    role: number;

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

    /**
     * Picture URL.
     */
    @Column(DbDataType.String, { name: 'picture_url', nullable: true })
    pictureUrl?: string | undefined;

    /**
     * Indicates if the member is a current member of the team.
     */
    @Column(DbDataType.Boolean, { name: 'is_active' })
    isActive: boolean;

    /**
     * The ID of the related player.
     */
    @Column(DbDataType.Int, { name: 'player_id', nullable: true })
    playerId: number | undefined;
}