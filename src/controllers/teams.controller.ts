import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiImplicitParam,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiUseTags,
  ApiResponse,
} from '@nestjs/swagger';
import {
  TeamProfileLightModel,
  TeamProfileModel,
  TeamStatsQuery,
  QueryResult,
  TeamQuery,
  TeamMatchHistoryStatsModel,
  TeamMatchHistoryStatsQuery,
  TeamOverallStatsWithRelationsModel,
  TeamChampionsStatsModel,
  TeamChampionsStatsQuery,
  WardResponse,
  TeamWardQuery,
 OpenApiType } from '../models';
import { BaseController } from './base.controller';
import { TeamsDataService } from '../data-services';


@Controller('teams')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('teams')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class TeamsController extends BaseController {
  constructor(private readonly dataService: TeamsDataService) {
    super();
  }

  /**
   * Searches for teams.
   * @param query Query.
   */
  @Put('query')
  @ApiOperation({ operationId: 'find', title: 'Searches for teams.' })
  @ApiOkResponse({ description: 'Search result.', type: QueryResult })
  @ApiResponse({
    status: 999,
    description: 'Model reference.',
    type: TeamProfileLightModel,
  }) // Add a reference to the generic type parameter
  async find(
    @Body() query: TeamQuery,
  ): Promise<QueryResult<TeamProfileLightModel>> {
    return this.dataService.find(query);
  }

  /**
   * Returns information about a team.
   * @param id The ID of the team.
   */
  @Get(':id/profile')
  @ApiOperation({
    operationId: 'getProfile',
    title: 'Returns information about a team.',
  })
  @ApiOkResponse({ description: 'Result.', type: TeamProfileModel })
  @ApiNotFoundResponse({ description: 'The team does not exist.' })
  @ApiImplicitParam({
    name: 'id',
    description: 'The ID of the team.',
    type: OpenApiType.Integer,
  })
  async getProfile(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<TeamProfileModel> {
    return super.okOrNotFound(
      await this.dataService.getProfile(id),
      'The team does not exist.',
    );
  }

  /**
   * Returns statistics about a team.
   * @param id The ID of the team.
   * @param query Query.
   */
  @Put(':id/stats/query')
  @ApiOperation({
    operationId: 'findStats',
    title: 'Returns statistics about a team.',
  })
  @ApiOkResponse({
    description: 'Result.',
    type: TeamOverallStatsWithRelationsModel,
  })
  @ApiNotFoundResponse({ description: 'The team does not exist.' })
  @ApiImplicitParam({
    name: 'id',
    description: 'The ID of the team.',
    type: OpenApiType.Integer,
  })
  async findStats(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() query: TeamStatsQuery,
  ): Promise<TeamOverallStatsWithRelationsModel> {
    return this.dataService.findStats(id, query);
  }

  /**
   * Returns statistics about ward events of a team
   * @param id The ID of the team
   * @param query Query.
   */
  @Put(':id/stats/wards')
  @ApiOperation({
    operationId: 'getWardsInfo',
    title: 'Returns statistics about ward events of a team',
  })
  @ApiOkResponse({
    description: 'Result.',
    type: WardResponse,
  })
  @ApiNotFoundResponse({ description: 'The team does not exist.' })
  @ApiImplicitParam({
    name: 'id',
    description: 'The ID of the team.',
    type: OpenApiType.Integer,
  })
  async getWardsInfo(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() query: TeamWardQuery,
  ): Promise<WardResponse> {
    return this.dataService.getWardsInfo(id, query);
  }

  /**
   * Return statistics about the match history of a team.
   * @param id The ID of the team
   * @param query Query
   */
  @Put(':id/matches/stats/query')
  @ApiOperation({
    operationId: 'findMatchHistoryStats',
    title: 'Return statistics about the match history of a team.',
  })
  @ApiOkResponse({
    description: 'Result.',
    type: TeamMatchHistoryStatsModel,
    isArray: true,
  })
  @ApiImplicitParam({
    name: 'id',
    description: 'The ID of the team.',
    type: OpenApiType.Integer,
  })
  async findMatchHistoryStats(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() query: TeamMatchHistoryStatsQuery,
  ): Promise<QueryResult<TeamMatchHistoryStatsModel>> {
    return this.dataService.findMatchHistoryStats(id, query);
  }

  /**
   * Return statistics about the champions of the team.
   * @param id The ID of the team
   * @param query Query
   */
  @Put(':id/champions/stats/query')
  @ApiOperation({
    operationId: 'findChampionsStats',
    title: 'Return statistics about the champions of the team.',
  })
  @ApiOkResponse({
    description: 'Result.',
    type: TeamChampionsStatsModel,
    isArray: true,
  })
  @ApiImplicitParam({
    name: 'id',
    description: 'The ID of the team.',
    type: OpenApiType.Integer,
  })
  async findChampionsStats(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() query: TeamChampionsStatsQuery,
  ): Promise<TeamChampionsStatsModel[]> {
    return this.dataService.findChampionsStats(id, query);
  }
}
