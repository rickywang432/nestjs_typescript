import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DbDataType } from './db-data-type';
import { GameFileMetadata } from '../models';
import { GameFileS3Info } from './game-file-s3.info';

/**
 * Contains information about video or audio uploaded for a game.
 */
@Entity('game_file')
export class GameFileEntity {
    /**
     * ID.
     */
    @PrimaryGeneratedColumn('increment', { name: 'id', type: DbDataType.Int })
    id: number;

    /**
     * Game unique ID.
     */
    @Column(DbDataType.String, { name: 'game_uid' })
    gameUid: string;

    /**
     * The ID of the user who created the record.
     */
    @Column(DbDataType.Int, { name:  'user_id'})
    userId: number;

    /**
     * The time when the upload has started.
     */
    @Column(DbDataType.DateTime, { name: 'upload_start_time_utc' })
    uploadStartTime: Date;

    /**
     * The time when the upload has completed.
     */
    @Column(DbDataType.DateTime, { name: 'upload_end_time_utc', nullable: true })
    uploadEndTime?: Date | undefined;

    /**
     * The status of the upload.
     */
    @Column(DbDataType.TinyInt, { name: 'upload_status' })
    uploadStatus: number;
        
    /**
     * The type of the file.
     */
    @Column(DbDataType.TinyInt, { name: 'type' })
    type: number;

    /**
     * The format of the file.
     */
    @Column(DbDataType.TinyInt, { name: 'format' })
    format: number;

    /**
     * The compression method.
     */
    @Column(DbDataType.TinyInt, { name: 'compression_method' })
    compressionMethod: number;

    /**
     * Metadata.
     */
    @Column(DbDataType.JsonBinary, { name: 'metadata', nullable: true })
    metadata?: GameFileMetadata | undefined;

    /**
     * S3-related information.
     */
    @Column(DbDataType.JsonBinary, { name: 's3_info', nullable: true })
    s3Info: GameFileS3Info;
}