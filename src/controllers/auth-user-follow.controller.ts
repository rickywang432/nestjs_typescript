import { Controller, Delete, Get, Param, ParseIntPipe, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiImplicitParam, ApiOkResponse, ApiOperation, ApiProduces, ApiUseTags } from '@nestjs/swagger';
import { OpenApiType , PlayerProfileLightModel } from '../models';
import { AuthUserFollowDataService } from '../data-services';

import { AuthenticatedUser } from '../security';
import { BaseController } from './base.controller';

/**
 * Provides endpoints to follow and unfollow players.
 */
@Controller('auth-user/follow')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('auth-user-follow')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class AuthUserFollowController extends BaseController {
    constructor(
        private readonly dataService: AuthUserFollowDataService
    ) { super(); }

    /**
     * Starts following a player.
     * @param id The ID of the player to follow.
     */
    @Put('player/:id')
    @ApiOperation({ operationId: 'followPlayer', title: 'Starts following a player.' })
    @ApiOkResponse({ description: 'The operation completed successfully.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player to follow.', type: OpenApiType.Integer })
    async followPlayer(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<void> {
        await this.dataService.followPlayer(user.id, id);
    }

    /**
     * Stops following a player.
     * @param id The ID of the player.
     */
    @Delete('player/:id')
    @ApiOperation({ operationId: 'unfollowPlayer', title: 'Stops following a player.' })
    @ApiOkResponse({ description: 'The operation completed successfully.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player.', type: OpenApiType.Integer })
    async unfollowPlayer(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<void> {
        await this.dataService.unfollowPlayer(user.id, id);
    }

    /**
     * Returns a value indicating if a player is being followed.
     * @param id The ID of the player.
     */
    @Get('player/:id/isFollowed')
    @ApiOperation({ operationId: 'isPlayerFollowed', title: 'Returns a value indicating if a player is being followed.' })
    @ApiOkResponse({ description: 'Result.', type: Boolean })
    async isPlayerFollowed(
        @Request() { user }: { user: AuthenticatedUser },
        @Param('id', new ParseIntPipe()) id: number
        ): Promise<boolean> {
        return await this.dataService.isPlayerFollowed(user.id, id);
    }

    /**
     * Returns the list of followed players.
     */
    @Get('players')
    @ApiOperation({ operationId: 'getPlayers', title: 'Returns the list of followed players.' })
    @ApiOkResponse({ description: 'Result.', type: PlayerProfileLightModel, isArray: true })
    async getPlayers(
        @Request() { user }: { user: AuthenticatedUser }
    ): Promise<PlayerProfileLightModel[]> {
        return await this.dataService.getPlayers(user.id);
    }
}