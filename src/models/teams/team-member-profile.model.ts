import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { PlayerRole } from '../players';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { TeamProfileNestedModel } from './team-profile-nested.model';

/**
 * Contains information about a team member.
 */
export class TeamMemberProfileModel {
    /**
     * ID.
     */
    @ApiModelProperty({ readOnly: true, description: 'ID.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    id: number;

    /**
     * Name.
     */
    @ApiModelProperty({ readOnly: true, description: 'Name.' })
    name: string;

    /**
     * The URL of the player's picture.
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'The URL of the player\'s picture.', type: OpenApiType.String })
    pictureUrl?: string | undefined;

    /**
     * The role of the player in the team.
     */
    @ApiModelProperty({ readOnly: true, description: 'The role of the player in the team.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
    role: PlayerRole;

    /**
     * Indicates if the player is present or former member of the team.
     */
    @ApiModelProperty({ readOnly: true, description: 'Indicates if the player is present or former member of the team.', type: OpenApiType.Boolean })
    isActive: boolean;

    /**
     * Information about the team the player is a member of.
     */
    @ApiModelProperty({ readOnly: true, description: 'The role of the player in the team.', type: TeamProfileNestedModel })
    team: TeamProfileNestedModel;

    constructor(data?: {
        id: number;
        name: string;
        pictureUrl?: string | undefined;
        role: PlayerRole;
        isActive: boolean;
        team: TeamProfileNestedModel;
    }) {
        if (data != undefined) {
            this.id = data.id;
            this.name = data.name;
            this.pictureUrl = data.pictureUrl;
            this.role = data.role;
            this.isActive = data.isActive;
            this.team = data.team;
        }
    }
}