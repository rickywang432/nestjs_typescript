import { Body, ConflictException, Controller, Get, NotFoundException, Param, ParseIntPipe, Put, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiImplicitParam, ApiImplicitQuery, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { strict as assert } from 'assert';
import * as AWS from 'aws-sdk';
import { OpenApiType , GameFileDownloadInfoModel, GameFileS3CredentialsModel, GameFileS3LocationModel, GameFileUploadStatus, GameLightModel, GameModel, GamePatchModel, GameQuery, GameSplitModel, GameStatsResponseModel, QueryResult } from '../models';
import config from '../app.config';
import { GamesDataService } from '../data-services';

import { AuthenticatedUser } from '../security';
import { BaseController } from './base.controller';

@Controller('games')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('games')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class GamesController extends BaseController {
    constructor(
        private readonly dataService: GamesDataService
    ) { super(); }

    /**
     * Searches for games.
     * @param query Query.
     */
    @Put('query')
    @ApiOperation({ operationId: 'find', title: 'Searches for games.' })
    @ApiOkResponse({ description: 'Result.', type: QueryResult })
    @ApiResponse({ status: 999, description: 'Model reference.', type: GameLightModel }) // Add a reference to the generic type parameter
    async find(
        @Body() query: GameQuery
    ): Promise<QueryResult<GameLightModel>> {
        return this.dataService.find(query);
    }

    /**
     * Returns information about a game.
     * @param id The ID of the game.
     */
    @Get(':id')
    @ApiOperation({ operationId: 'get', title: 'Returns information about a game.' })
    @ApiOkResponse({ description: 'Result.', type: GameModel })
    @ApiNotFoundResponse({ description: 'The game does not exist.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the game.' })
    async get(
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<GameModel> {
        const result = await this.dataService.get(id);

        if (result == undefined) {
            throw new NotFoundException('The game does not exist.');
        } else {
            return result;
        }
    }

        /**
     * Returns information about a game.
     * @param id The ID of the game.
     */
    @Get(':id/stats')
    @ApiOperation({ operationId: 'getStats', title: 'Returns stats information about a game.' })
    @ApiOkResponse({ description: 'Result.', type: GameStatsResponseModel })
    @ApiNotFoundResponse({ description: 'The game does not exist.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the game.' })
    async getStats(
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<GameStatsResponseModel> {
        const result = await this.dataService.getStats(id);

        if (result == undefined) {
            throw new NotFoundException('The game does not exist.');
        } else {
            return result;
        }
    }

    /**
     * Returns information that can be used to download the content of a game-related file from S3.
     * @param gameId The ID of the game.
     * @param fileId The ID of the file.
     */
    @Get(':gameId/files/:fileId')
    @ApiOperation({ operationId: 'getFileDownloadInfo', title: 'Returns information that can be used to download the content of a game-related file from S3.' })
    @ApiOkResponse({ description: 'Information that can be used to download the file from S3.', type: GameFileDownloadInfoModel })
    @ApiNotFoundResponse({ description: 'The file does not exist.' })
    @ApiImplicitParam({ name: 'gameId', description: 'The ID of the game.', type: OpenApiType.Integer })
    @ApiImplicitParam({ name: 'fileId', description: 'The ID of the file.', type: OpenApiType.Integer })
    async getFileDownloadInfo(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('gameId', new ParseIntPipe()) gameId: number,
        @Param('fileId', new ParseIntPipe()) fileId: number
    ): Promise<GameFileDownloadInfoModel> {
        const dbResult = await this.dataService.getFileS3Info(user.id, gameId, fileId);

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

    /* #region Common */

    /**
     * Returns information about all splits.
     * @param includeInactive Indicates if inactive splits should be returned.
     */
    @Get('splits')
    @ApiOperation({ operationId: 'getSplits', title: 'Returns information about all patches for which games have been recorded.' })
    @ApiOkResponse({ description: 'Result.', type: GameSplitModel, isArray: true })
    @ApiImplicitQuery({ name: 'includeInactive', description: 'Indicates if inactive patches should be returned.', type: OpenApiType.Boolean, required: false })
    async getSplits(
        @Query() includeInactive: boolean | undefined
    ): Promise<GameSplitModel[]> {
        return this.dataService.getSplits(includeInactive);
    }

    /**
     * Returns information about all patches for which games have been recorded.
     * @param includeInactive Indicates if inactive patches should be returned.
     */
    @Get('patches')
    @ApiOperation({ operationId: 'getPatches', title: 'Returns information about all patches for which games have been recorded.' })
    @ApiOkResponse({ description: 'Result.', type: GamePatchModel, isArray: true })
    @ApiImplicitQuery({ name: 'includeInactive', description: 'Indicates if inactive patches should be returned.', type: OpenApiType.Boolean, required: false })
    async getPatches(
        @Query() includeInactive: boolean | undefined
    ): Promise<GamePatchModel[]> {
        return this.dataService.getPatches(includeInactive);
    }

    /* #endregion */
}