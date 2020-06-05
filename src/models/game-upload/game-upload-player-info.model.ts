import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmptyObject, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { ChampionBuild } from '../game-common';
import { PlayerRole, PlayerStatsModel } from '../players';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { SummonerIdentityModel } from './summoner-identity.model';

/**
 * Information about a player during a game.
 */
export class GameUploadPlayerInfoModel {
    /**
     * Then identity of the summoner.
     */
    @ApiModelProperty({ description: 'Then identity of player\'s summoner.', type: SummonerIdentityModel })
    @IsObject()
    @ValidateNested()
    @Type(() => SummonerIdentityModel)
    summonerIdentity: SummonerIdentityModel;

    /**
     * The ID of the player's champion.
     */
    @ApiModelProperty({ description: 'The ID of the player\'s champion.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsInt()
    championId: number;

    /**
     * The build of the champion.
     */
    @ApiModelPropertyOptional({ description: 'The build of the champion.', type: ChampionBuild })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => ChampionBuild)
    championBuild: ChampionBuild | undefined;

    /**
     * The role of the player during the game.
     */
    @ApiModelProperty({ description: 'The role of the player during the game.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsEnum(PlayerRole)
    role: PlayerRole;

    /**
     * Statistics (depends on the role).
     */
    @ApiModelProperty({ description: 'Statistics (depends on the role).', type: PlayerStatsModel })
    @IsObject()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(() => PlayerStatsModel)
    stats: PlayerStatsModel;
}