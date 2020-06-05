import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsObject, Max, Min, ValidateNested, IsString, MinLength, MaxLength } from 'class-validator';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { GameTeamSide } from './game-team-side.enum';
import { WardType } from './ward-type.enum';
import { WardCoordinatesModel } from './ward-coordinates.model';
import { PlayerRole } from '../players/player-role.enum';

/**
 * Contains information about an event - placing a ward.
 */
export class GameWardEventInfoModel {
    /**
     * The name of summoner of the player who placed the ward.
     */
    @ApiModelProperty({ description: 'The name of the summoner of the player who placed the ward.', type: OpenApiType.String })
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    summonerName: string;

    /**
     * The type of the ward.
     */
    @ApiModelProperty({ description: 'The type of the ward.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsEnum(WardType)
    type: WardType;

    /**
     * The team who places the ward.
     */
    @ApiModelProperty({ description: 'The team who places the ward.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsEnum(GameTeamSide)
    teamSide: GameTeamSide;

    /**
     * role: Role of the player who placed this ward.
     */
    @ApiModelProperty({
        description: 'Role of the player who placed this ward',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsEnum(PlayerRole)
    role: PlayerRole;
    
    /**
     * The number of seconds since the beginning of the game when the ward has been placed.
     */
    @ApiModelProperty({ description: 'The number of seconds since the beginning of the game when the ward has been placed.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsInt()
    @Min(0)
    @Max(3600 * 24)
    timeOffsetSeconds: number;

    /**
     * Coordinates.
     */
    @ApiModelProperty({ description: 'Coordinates.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsObject()
    @ValidateNested()
    @Type(() => WardCoordinatesModel)
    coordinates: WardCoordinatesModel;
}
