import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { DbDataType } from './db-data-type';

/**
 * Contains information about a user.
 */
@Entity('user')
export class UserEntity {
    /**
     * ID.
     */
    @PrimaryGeneratedColumn('increment', { type: DbDataType.Int })
    id: number;

    /**
     * ID (provided by the auth server).
     */
    @Column(DbDataType.Int, { name: 'auth_id' })
    authId: number;

    /**
     * Name (provided by the auth server).
     */
    @Column(DbDataType.String, { name: 'auth_name' })
    authName: string;
}