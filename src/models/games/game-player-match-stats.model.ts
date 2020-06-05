import { ApiModelProperty } from '@nestjs/swagger';

export class PlayerMatchStatsModel {

    /**
     * The average number of kills.
     */
    @ApiModelProperty({ readOnly: true, description: 'The average number of kills of the player in the game.' })
    avgKillCount: number;

    /**
     * The average number of deaths.
     */
    @ApiModelProperty({ readOnly: true, description: 'The average number of deaths of the player in the game.' })
    avgDeathCount: number;

    /**
     * The average number of assists.
     */
    @ApiModelProperty({ readOnly: true, description: 'The average number of assists of the player in the game.' })
    avgAssistCount: number;

    /**
     * The average number of total gold.
     */
    @ApiModelProperty({ readOnly: true, description: 'The average number of total gold of the player in the game.' })
    avgGoldCount: number;

    constructor(data: {
        avgKillCount: number;
        avgDeathCount: number;
        avgAssistCount: number;
        avgGoldCount: number;
    }) {
        if (data != undefined) {
            this.avgKillCount = data.avgKillCount;
            this.avgDeathCount = data.avgDeathCount;
            this.avgAssistCount = data.avgAssistCount;
            this.avgGoldCount = data.avgGoldCount;
        }
    }
}
