import { BadRequestException, Body, ConflictException, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConflictResponse, ApiConsumes, ApiImplicitParam, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiUseTags } from '@nestjs/swagger';
import { strict as assert } from 'assert';
import * as AWS from 'aws-sdk';
import { Validator } from 'class-validator';
import config from '../app.config';
import { GameFileDownloadInfoModel, GameFileModel, GameFileS3CredentialsModel, GameFileS3LocationModel, GameFileType, GameFileTypeNames, GameFileUpdateModel, GameFileUploadInfoModel, GameFileUploadStatus, GameUploadInfoModel , OpenApiType } from '../models';
import { AuthenticatedUser } from '../security';
import { DbModificationOperationResult, AuthUserGamesDataService as AuthUserGamesDataService } from '../data-services';
import { ValidationUtils } from '../tools/validation-utils';
import { BaseController } from './base.controller';


/**
 * Provides endpoints to upload and download files for games in which the authenticated user participate.
 */
@Controller('auth-user/games')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('auth-user-games')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class AuthUserGamesController extends BaseController {
    constructor(
        private readonly dataService: AuthUserGamesDataService
    ) { super(); }
    
    /* #region Info */

    /**
     * Updates the information stored about a game.
     * @param gameUid The unique ID of the game.
     * @param model Game information.
     */
    @Put(':uid/info')
    @ApiOperation({ operationId: 'updateInfo', title: 'Updates the information stored about a game.' })
    @ApiOkResponse({ description: 'The information has been updated successfully.' })
    @ApiConflictResponse({ description: 'The upload information is not consistent with the user and team information available.' })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    async updateInfo(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
        @Body() model: GameUploadInfoModel
    ): Promise<void> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }
        
        await this.dataService.updateGameInfo(user.id, gameUid, model);
    }

    /* #endregion Info */

    /* #region Files */

    /**
     * Returns information about all file related tp a game.
     * @param gameUid The unique ID of the game.
     */
    @Get(':uid/files')
    @ApiOperation({ operationId: 'getAllFiles', title: 'Returns information about all file related tp a game.' })
    @ApiOkResponse({ description: 'Information about the files.', type: GameFileModel, isArray: true })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    getAllFiles(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
    ): Promise<GameFileModel[]> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }

        return this.dataService.getAllFiles(user.id, gameUid);
    }

    /**
     * Returns information about a file related tp a game.
     * @param gameUid The unique ID of the game.
     * @param type The type of the file.
     */
    @Get(':uid/files/:type')
    @ApiOperation({ operationId: 'getFile', title: 'Returns information about a file related tp a game.' })
    @ApiOkResponse({ description: 'Information about the file.', type: GameFileModel })
    @ApiNotFoundResponse({ description: 'The file does not exist.' })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    @ApiImplicitParam({ name: 'type', description: 'The type of the file.', type: OpenApiType.Integer })
    async getFile(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
        @Param('type', new ParseIntPipe()) type: GameFileType,
    ): Promise<GameFileModel> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }
        if (false == new Validator().isEnum(type, GameFileType)) {
            throw new BadRequestException('Invalid file type.');
        }

        return super.okOrNotFound(await this.dataService.getFile(user.id, gameUid, type), 'The file does not exist.');
    }

    /**
     * Creates a new file related to a game.
     * @param gameUid The unique ID of the game.
     * @param type The type of the file.
     * @description There can be at most one file uploaded for each file type.
     */
    @Post(':uid/files/:type')
    @ApiOperation({ operationId: 'createFile', title: 'Creates a new file related to a game.' })
    @ApiOkResponse({ description: 'The file has been created successfully.' })
    @ApiConflictResponse({ description: 'A file of the same type for the same game by the same user already exist.' })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    @ApiImplicitParam({ name: 'type', description: 'The type of the file.', type: OpenApiType.Integer })
    async createFile(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
        @Param('type', new ParseIntPipe()) type: GameFileType,
        @Body() model: GameFileUpdateModel
    ): Promise<void> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }
        if (false == new Validator().isEnum(type, GameFileType)) {
            throw new BadRequestException('Invalid file type.');
        }

        const dbResult = await this.dataService.createFile(user.id, gameUid, type, model);

        if (dbResult) {
            // File created
        } else {
            // A file of the same type for the same game by the same user already exist
            throw new ConflictException('A file of the same type for the same game by the same user already exist.');
        }
    }

    /**
     * Returns information that can be used to upload the content of a game-related file to S3.
     * @param gameUid The unique ID of the game.
     * @param type The type of the file.
     */
    @Get(':uid/files/:type/upload-info')
    @ApiOperation({ operationId: 'getFileUploadInfo', title: 'Returns information that can be used to upload the content of a game-related file to S3.' })
    @ApiOkResponse({ description: 'Information that can be used to upload the file to S3.', type: GameFileUploadInfoModel })
    @ApiNotFoundResponse({ description: 'The file does not exist.' })
    @ApiConflictResponse({ description: 'The file is already uploaded.' })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    @ApiImplicitParam({ name: 'type', description: 'The type of the file.', type: OpenApiType.Integer })
    async getFileUploadInfo(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
        @Param('type', new ParseIntPipe()) type: GameFileType
    ): Promise<GameFileUploadInfoModel> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }
        if (false == new Validator().isEnum(type, GameFileType)) {
            throw new BadRequestException('Invalid file type.');
        }

        const dbResult = await this.dataService.getFileS3Info(user.id, gameUid, type);

        if (dbResult == undefined) {
            throw new NotFoundException('The file does not exist.');
        }

        if (dbResult.uploadStatus == GameFileUploadStatus.Complete) {
            throw new ConflictException('The file is already uploaded.');
        }

        if (dbResult.s3Info.key == undefined || dbResult.s3Info.multipartUploadId == undefined) {
            // The multi-part upload is not created yet

            // CAUTION: Using the auth ID of the user for S3 keys makes it easier to match uploaded files to users in the auth DB.
            dbResult.s3Info.key = `games/${gameUid}/${user.authId}/${GameFileTypeNames[type]}${dbResult.s3Info.fileNameExtension}`;

            const awsResponse = await new AWS.S3({ region: config.aws.fileS3BucketRegion }).createMultipartUpload({
                Bucket: config.aws.fileS3BucketName,
                Key: dbResult.s3Info.key,
                ContentType: dbResult.s3Info.mimeContentType,
            }).promise();

            dbResult.s3Info.multipartUploadId = awsResponse.UploadId;

            this.dataService.updateFileS3Info(
                user.id,
                gameUid,
                type,
                dbResult.s3Info
            );
        }

        const awsCredentials = await new AWS.STS().getFederationToken({
            Name: `user-id-${user.id}`,
            DurationSeconds: 24 * 60 * 60, // 24 hours
            Policy: JSON.stringify({
                'Version': '2012-10-17',
                'Statement': [{
                    'Effect': 'Allow',
                    'Action': ['s3:PutObject', 's3:GetObject', 's3:AbortMultipartUpload', 's3:ListMultipartUploadParts'],
                    'Resource': [`arn:aws:s3:::${config.aws.fileS3BucketName}/${dbResult.s3Info.key}`],
                }],
            }),
        }).promise();

        const result = new GameFileUploadInfoModel();

        result.s3Credentials = new GameFileS3CredentialsModel();
        result.s3Credentials.accessKeyId = awsCredentials!.Credentials!.AccessKeyId;
        result.s3Credentials.secretAccessKey = awsCredentials!.Credentials!.SecretAccessKey;
        result.s3Credentials.sessionToken = awsCredentials!.Credentials!.SessionToken;
        result.s3Credentials.expiration = awsCredentials!.Credentials!.Expiration;

        result.s3Location = new GameFileS3LocationModel();
        result.s3Location.bucketName = config.aws.fileS3BucketName;
        result.s3Location.bucketIsAccelerated = config.aws.fileS3BucketIsAccelerated;
        result.s3Location.bucketRegion = config.aws.fileS3BucketRegion;
        result.s3Location.key = dbResult.s3Info.key;

        result.s3MultipartUploadId = dbResult.s3Info.multipartUploadId!;

        return result;
    }

    /**
     * Returns information that can be used to download the content of a game-related file from S3.
     * @param gameUid The unique ID of the game.
     * @param type The type of the file.
     */
    @Get(':uid/files/:type/download-info')
    @ApiOperation({ operationId: 'getFileDownloadInfo', title: 'Returns information that can be used to download the content of a game-related file from S3.' })
    @ApiOkResponse({ description: 'Information that can be used to download the file from S3.', type: GameFileDownloadInfoModel })
    @ApiNotFoundResponse({ description: 'The file does not exist.' })
    @ApiConflictResponse({ description: 'The file is not uploaded to S3.' })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    @ApiImplicitParam({ name: 'type', description: 'The type of the file.', type: OpenApiType.Integer })
    async getFileDownloadInfo(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
        @Param('type', new ParseIntPipe()) type: GameFileType
    ): Promise<GameFileDownloadInfoModel> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }
        if (false == new Validator().isEnum(type, GameFileType)) {
            throw new BadRequestException('Invalid file type.');
        }

        const dbResult = await this.dataService.getFileS3Info(user.id, gameUid, type);

        if (dbResult == undefined) {
            throw new NotFoundException('The file does not exist.');
        }

        if (dbResult.uploadStatus != GameFileUploadStatus.Complete) {
            throw new ConflictException('The file upload is not complete.');
        }

        assert(dbResult.s3Info.key != undefined, 'The S3 info of the file does not contain a key.');

        const awsCredentials = await new AWS.STS().getFederationToken({
            Name: `user-id-${user.id}`,
            DurationSeconds: 24 * 60 * 60, // 24 hours
            Policy: JSON.stringify({
                'Version': '2012-10-17',
                'Statement': [{
                    'Effect': 'Allow',
                    'Action': ['s3:GetObject'],
                    'Resource': [`arn:aws:s3:::${config.aws.fileS3BucketName}/${dbResult.s3Info.key}`],
                }],
            }),
        }).promise();

        const result = new GameFileDownloadInfoModel();

        result.s3Credentials = new GameFileS3CredentialsModel();
        result.s3Credentials.accessKeyId = awsCredentials!.Credentials!.AccessKeyId;
        result.s3Credentials.secretAccessKey = awsCredentials!.Credentials!.SecretAccessKey;
        result.s3Credentials.sessionToken = awsCredentials!.Credentials!.SessionToken;
        result.s3Credentials.expiration = awsCredentials!.Credentials!.Expiration;

        result.s3Location = new GameFileS3LocationModel();
        result.s3Location.bucketName = config.aws.fileS3BucketName;
        result.s3Location.bucketRegion = config.aws.fileS3BucketRegion;
        result.s3Location.bucketIsAccelerated = config.aws.fileS3BucketIsAccelerated;
        result.s3Location.key = dbResult.s3Info.key;

        // CAUTION: The region is important as it is included in the URL
        result.url = await new AWS.S3({ region: config.aws.fileS3BucketRegion, useAccelerateEndpoint: config.aws.fileS3BucketIsAccelerated }).getSignedUrlPromise('getObject', {
            Bucket: config.aws.fileS3BucketName,
            Key: dbResult.s3Info.key,
            Expires: 24 * 60 * 60, // 24h
        });

        return result;
    }

    /**
     * Marks a file upload as complete.
     * @param gameUid The unique ID of the game.
     * @param type The type of the file.
     */
    @Put(':uid/files/:type/actions/complete')
    @ApiOperation({ operationId: 'completeFileUpload', title: 'Marks a file upload as completed.' })
    @ApiOkResponse({ description: 'The file upload has been marked as complete or was already marked complete.' })
    @ApiNotFoundResponse({ description: 'The file upload does not exist.' })
    @ApiImplicitParam({ name: 'uid', description: 'The unique ID of the game.' })
    @ApiImplicitParam({ name: 'type', description: 'The type of the file.', type: OpenApiType.Integer })
    async completeFileUpload(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('uid') gameUid: string,
        @Param('type', new ParseIntPipe()) type: GameFileType
    ): Promise<void> {
        if (false == ValidationUtils.isValidGameUid(gameUid)) {
            throw new BadRequestException('Invalid game UID.');
        }

        const dbResult = await this.dataService.completeFileUpload(user.id, gameUid, type);

        if (dbResult == DbModificationOperationResult.NotFound) {
            throw new NotFoundException('The file upload does not exist or is already marked as complete.');
        }
    }

    /* #endregion */
}
