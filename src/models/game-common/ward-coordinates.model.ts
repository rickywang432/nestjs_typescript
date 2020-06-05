import { ApiModelProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

/**
 * Contains the coordinates of a ward.
 */
export class WardCoordinatesModel {
    /**
     * X.
     */
    @ApiModelProperty({ description: 'X.' })
    @IsNumber()
    x: number;
    /**
     * Y.
     */
    @ApiModelProperty({ description: 'Y.' })
    @IsNumber()
    y: number;
    /**
     * Z.
     */
    @ApiModelProperty({ description: 'Z.' })
    @IsNumber()
    z: number;
}