import { Body, Controller, Get, Param, ParseIntPipe, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiImplicitParam, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { PlayerChampionStatsModel, PlayerProfileLightModel, PlayerProfileModel, PlayerQuery, PlayerComparableStatsModel, PlayerStatsModel,  PlayerStatsQuery, QueryResult, WardResponse, PlayerWardQuery , OpenApiType } from '../models';
import { BaseController } from './base.controller';
import { PlayersDataService } from '../data-services';


@Controller('players')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('players')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class PlayersController extends BaseController {
    constructor(
        private readonly dataService: PlayersDataService
    ) { super(); }

    /**
     * Searches for players.
     * @param query Query.
     */
    @Put('query')
    @ApiOperation({ operationId: 'find', title: 'Searches for players.' })
    @ApiOkResponse({ description: 'Search result.', type: QueryResult })
    @ApiResponse({ status: 999, description: 'Model reference.', type: PlayerProfileLightModel }) // Add a reference to the generic type parameter
    async find(
        @Body() query: PlayerQuery
    ): Promise<QueryResult<PlayerProfileLightModel>> {
        return this.dataService.find(query);
    }

    /**
     * Returns information about a player.
     * @param id The ID of the player.
     */
    @Get(':id/profile')
    @ApiOperation({ operationId: 'getProfile', title: 'Returns information about a player.' })
    @ApiOkResponse({ description: 'Result.', type: PlayerProfileModel })
    @ApiNotFoundResponse({ description: 'The player does not exist.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player.', type: OpenApiType.Integer })
    async getProfile(
        @Param('id', new ParseIntPipe()) id: number
    ): Promise<PlayerProfileModel> {
        return super.okOrNotFound(await this.dataService.getProfile(id), 'The player does not exist.');
    }

    /**
     * Returns statistics about a player.
     * @param id The ID of the player.
     * @param query Query.
     */
    @Put(':id/stats/query')
    @ApiOperation({ operationId: 'findStats', title: 'Returns statistics about a player.' })
    @ApiOkResponse({ description: 'Result.', type: PlayerStatsModel })
    @ApiNotFoundResponse({ description: 'The player does not exist.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player.', type: OpenApiType.Integer })
    async findStats(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() query: PlayerStatsQuery
    ): Promise<PlayerComparableStatsModel> {
        return this.dataService.findStats(id, query);
    }

    /**
     * Returns statistics about wards of a player.
     * @param id The ID of the player.
     * @param query Query.
     */
    @Put(':id/stats/wards')
    @ApiOperation({ operationId: 'getWardsInfo', title: 'Returns statistics of ward of a player.' })
    @ApiOkResponse({ description: 'Result.', type: WardResponse })
    @ApiNotFoundResponse({ description: 'The player does not exist.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player.', type: OpenApiType.Integer })
    async getWardsInfo(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() query: PlayerWardQuery
    ): Promise<WardResponse> {
        return this.dataService.getWardsInfo(id, query);
    }

    /**
     * Returns statistics about the champions of a player.
     * @param id The ID of the player.
     * @param query Query.
     */
    @Put(':id/champions/stats/query')
    @ApiOperation({ operationId: 'findChampionStats', title: 'Returns statistics about the champions of a player.' })
    @ApiOkResponse({ description: 'Result.', type: PlayerChampionStatsModel, isArray: true })
    @ApiNotFoundResponse({ description: 'The player does not exist.' })
    @ApiImplicitParam({ name: 'id', description: 'The ID of the player.', type: OpenApiType.Integer })
    async findChampionStats(
        @Param('id', new ParseIntPipe()) id: number,
        @Body() query: PlayerStatsQuery
    ): Promise<PlayerChampionStatsModel[]> {
        return this.dataService.findChampionStats(id, query);
    }
}