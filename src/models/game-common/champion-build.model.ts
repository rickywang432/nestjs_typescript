import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { ChampionSkillModel } from './champion-skill.model';
import { ChampionBuildPathModel } from './champion-build-path.model';

/**
 * Contains information about the build of a champion.
 */
export class ChampionBuild {

    @ApiModelPropertyOptional({ description: 'Rune shards', type: OpenApiType.Integer, format: OpenApiFormat.Int32, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(100)
    @IsInt({ each: true })
    runeShards?: number[] | undefined;

    @ApiModelPropertyOptional({ description: 'Rune primary tree', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsInt()
    runePrimaryTree?: number | undefined;

    @ApiModelPropertyOptional({ description: 'Rune secondary tree', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    @IsOptional()
    @IsInt()
    runeSecondaryTree?: number | undefined;

    @ApiModelPropertyOptional({ description: 'Skill order', type: ChampionSkillModel, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(100)
    @ValidateNested()
    @Type(() => ChampionSkillModel)
    skillOrder?: ChampionSkillModel[] | undefined;

    /**
     * Spells.
     */
    @ApiModelPropertyOptional({ description: 'Spells.', type: OpenApiType.Integer, format: OpenApiFormat.Int32, isArray: true })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(100)
    @IsInt({ each: true })
    spells: number[] | undefined;

    /**
     * Starting Items.
     */
    @ApiModelPropertyOptional({
        description: 'Starting Items',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(100)
    @IsInt({ each: true })
    startingItems: number[] | undefined;

    @ApiModelPropertyOptional({
        description: 'Full Build paths',
        type: ChampionBuildPathModel,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(100)
    @ValidateNested()
    @Type(() => ChampionBuildPathModel)
    buildPaths: ChampionBuildPathModel[];

    @ApiModelPropertyOptional({
        description: 'Final Builds',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayMaxSize(100)
    @IsInt({ each: true })
    finalBuilds: number[] | undefined;
}
