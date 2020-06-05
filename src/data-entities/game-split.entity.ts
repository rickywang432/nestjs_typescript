import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about a split.
 */
@Entity('game_split')
export class GameSplitEntity {
    /**
     * ID.
     */
    @PrimaryGeneratedColumn('increment', { name: 'id', type: DbDataType.SmallInt })
    id: number;

    /**
     * Name.
     */
    @Column(DbDataType.String, { name: 'name' })
    name: string;

    /**
     * The ID of the region the split belongs to.
     */
    @Column(DbDataType.String, { name: 'region_id' })
    regionId: string;

    /**
     * The time when the split starts.
     */
    @Column(DbDataType.DateTime, { name: 'start_date_utc' })
    startTime: Date;

    /**
     * The time when the split ends.
     */
    @Column(DbDataType.DateTime, { name: 'end_date_utc' })
    endTime: Date;

    /**
     * Indicates if the split is outdated.
     */
    @Column(DbDataType.Boolean, { name: 'is_active' })
    isActive: boolean;
}