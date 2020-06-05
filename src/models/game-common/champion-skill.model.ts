import { ApiModelProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { OpenApiFormat, OpenApiType } from '../open-api-type';

export enum SkillSlot {
    Q = 1,
    W = 2,
    E = 3,
    R = 4,
}

/**
 * Contains information about the build of a champion.
 */
export class ChampionSkillModel {
    @ApiModelProperty({
        description: 'Skill slot, Q(1),W(2),E(3),R(4)',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsEnum(SkillSlot)
    skillSlot: SkillSlot;

    @ApiModelProperty({
        description: 'New Level',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsInt()
    @Min(0)
    level: number;

    @ApiModelProperty({
        description: 'The time in milliseconds got this skill levelled up',
        type: OpenApiType.Integer,
        format: OpenApiFormat.Int32,
    })
    @IsInt()
    @Min(0)
    timeInMs: number;
}
