import { Entity, PrimaryColumn, Unique, Column } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about a game patch (LoL software version).
 */
@Entity('game_patch')
@Unique(['name'])
export class GamePatchEntity {
    /**
     * Name.
     */
    @PrimaryColumn(DbDataType.String, { name: 'name' })
    name: string;

    /**
     * Indicates if the split is outdated.
     */
    @Column(DbDataType.Boolean, { name: 'is_active' })
    isActive: boolean;        
}