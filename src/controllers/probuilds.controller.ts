import { Body, Controller, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiConsumes, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiProduces, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { ProbuildsDataService } from '../data-services';
import { QueryResult } from '../models/common';
import { ProbuildModel } from '../models/probuilds';
import { ProbuildQuery } from '../models/probuilds/probuild-query.model';
import { AuthenticatedUser } from '../security';
import { BaseController } from './base.controller';

@Controller('probuilds')
@UseGuards(AuthGuard('bearer'))
@ApiUseTags('probuilds')
@ApiBearerAuth()
@ApiConsumes('application/json')
@ApiProduces('application/json')
export class ProbuildsController extends BaseController {
    constructor(
        private readonly dataService: ProbuildsDataService,
    ) {
        super();
    }

    @Put('query')
    @ApiOperation({ operationId: 'find', title: 'Returns the list of probuilds' })
    @ApiOkResponse({ description: 'Result.', type: QueryResult })
    @ApiNotFoundResponse({ description: 'There are no probuilds available' })
    @ApiResponse({ status: 999, description: 'Model reference.', type: ProbuildModel }) // Add a reference to the generic type parameter
    async getProbuilds(
        @Request() { user }: { user: AuthenticatedUser },
        @Body() query: ProbuildQuery,
    ): Promise<QueryResult<ProbuildModel>> {
        return this.dataService.find(user.id, user.teamMember?.teamId, query);
    }
}
