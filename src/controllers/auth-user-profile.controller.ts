import { Controller, NotFoundException, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiImplicitParam, ApiOkResponse, ApiOperation, ApiProduces, ApiUseTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { OpenApiType , PlayerProfileModel, TeamProfileModel } from '../models';
import { PlayersDataService, TeamsDataService } from '../data-services';

import { AuthenticatedUser } from '../security';
import { BaseController } from './base.controller';

/**
 * Provides endpoints to follow and unfollow players.
 */
@Controller('auth-user/profile')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('auth-user-profile')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class AuthUserProfileController extends BaseController {
    constructor(
        private readonly playerDataService: PlayersDataService,
        private readonly teamDataService: TeamsDataService
    ) { super(); }

    /**
     * Returns information about the authenticated user.
     */
    @Put('player')
    @ApiOperation({ operationId: 'getPlayer', title: 'Returns information about the authenticated user.' })
    @ApiOkResponse({ description: 'The operation completed successfully.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player to follow.', type: OpenApiType.Integer })
    async getPlayer(
        @Request() { user }: { user: AuthenticatedUser }
    ): Promise<PlayerProfileModel> {
        if (user.playerId == undefined) {
            throw new NotFoundException('The user does not have a record.');
        } else {
            return super.okOrNotFound(await this.playerDataService.getProfile(user.playerId), 'The user does not have a record.');
        }
    }

    /**
     * Returns information about the team (if any) the authenticated user is a member of.
     */
    @Put('team')
    @ApiOperation({ operationId: 'getTeam', title: 'Returns information about the team (if any) the authenticated user is a member of.' })
    @ApiOkResponse({ description: 'The operation completed successfully.' })
    @ApiNotFoundResponse({ description: 'The player is not a member of a team.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player to follow.', type: OpenApiType.Integer })
    async getTeam(
        @Request() { user }: { user: AuthenticatedUser }
    ): Promise<TeamProfileModel> {
        if (user.teamMember == undefined) {
            throw new NotFoundException('The user is not a member of a team.');
        } else {
            return super.okOrNotFound(await this.teamDataService.getProfile(user.teamMember.teamId), 'The user is not a member of a team.');
        }
    }
}