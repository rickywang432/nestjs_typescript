import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about a team.
 */
@Entity('team')
@Unique(['name'])
@Unique(['nameId'])
export class TeamEntity {
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

    /**
     * Type.
     */
    @Column(DbDataType.TinyInt, { name: 'name' })
    type: number;

    /**
     * Region ID (e.g. "na1").
     */
    @Column(DbDataType.String, { name: 'region_id' })
    regionId: string;

    /**
     * Logo URL.
     */
    @Column(DbDataType.String, { name: 'logo_url', nullable: true })
    logoUrl?: string | undefined;

    /**
     * Indicates if the team is active.
     */
    @Column(DbDataType.Boolean, { name: 'is_active' })
    isActive: boolean;    
}