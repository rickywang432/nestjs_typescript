import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiFormat, OpenApiType } from '../open-api-type';
import { TeamMemberProfileModel } from '../teams';

/**
 * Contains information about a player.
 */
export class PlayerProfileModel {
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
     * The name of the summoner of the player.
     */
    @ApiModelProperty({ readOnly: true, description: 'The name of the summoner of the player.' })
    summonerName: string;

    /**
     * The URL of the player's picture.
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'The URL of the player\'s picture.', type: OpenApiType.String })
    pictureUrl?: string | undefined;

    /**
     * Information about the team (if any) the player is a member of.
     */
    @ApiModelPropertyOptional({ readOnly: true, description: 'Information about the team (if any) the player is a member of.', type: TeamMemberProfileModel })
    teamMember?: TeamMemberProfileModel | undefined;

    constructor(data?: {
        id: number;
        name: string;
        summonerName: string;
        pictureUrl?: string | undefined;
        teamMember?: TeamMemberProfileModel | undefined;
    }) {
        if (data != undefined) {
            this.id = data.id;
            this.name = data.name;
            this.summonerName = data.summonerName;
            this.pictureUrl = data.pictureUrl;
            this.teamMember = data.teamMember;
        }
    }
}