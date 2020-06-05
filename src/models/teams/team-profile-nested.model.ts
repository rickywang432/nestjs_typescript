import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OpenApiType, OpenApiFormat } from '../open-api-type';
import { TeamType } from './team-type.enum';

/**
 * Contains information about a team.
 */
export class TeamProfileNestedModel {
  /**
   * ID.
   */
  @ApiModelProperty({
    readOnly: true,
    description: 'ID.',
    type: OpenApiType.Integer,
    format: OpenApiFormat.Int32,
  })
  id: number;

  /**
   * Name.
   */
  @ApiModelProperty({ readOnly: true, description: 'Name.' })
  name: string;

  /**
   * Type.
   */
  @ApiModelProperty({ readOnly: true, description: 'Type.', type: OpenApiType.Integer, format: OpenApiFormat.Int32 })
  type: TeamType;

  /**
   * Region.
   */
  @ApiModelProperty({ readOnly: true, description: 'Region.' })
  regionId: string;

  /**
   * The URL of the team's logo.
   */
  @ApiModelPropertyOptional({ readOnly: true, description: 'The URL of the team\'s logo.', type: OpenApiType.String })
  logoUrl?: string | undefined;

  constructor(data?: {
    id: number;
    name: string;
    type: TeamType;
    regionId: string;
    logoUrl?: string | undefined;
  }) {
    if (data != undefined) {
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
      this.regionId = data.regionId;
      this.logoUrl = data.logoUrl;
    }
  }
}
