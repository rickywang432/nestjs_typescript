import {
    PlayerStatsModel,
    PlayerRole,
    PlayerTopStatsModel,
    PlayerMiddleStatsModel,
    PlayerBottomStatsModel,
    PlayerJunglerStatsModel,
    PlayerSupportStatsModel,
} from '../models';


/**
 * Provides access to game stats data.
 */
class GameStatsModel {
    role: PlayerRole[];
    myTeam: PlayerStatsModel[];
    enemyTeam: PlayerStatsModel[];
}

/**
 * Get a Top player's information during given games.
 * @param gameStats[]: The game state info during given games.
 * @returns PlayerTopStatsModel
 */
function getTopPlayerStats(
    playerRole: PlayerRole,
    gameStats: GameStatsModel[],
): PlayerTopStatsModel {
    const result = new PlayerTopStatsModel();
    result.init();
    gameStats.forEach((gameStat: GameStatsModel) => {
        if (gameStat && gameStat.myTeam &&
            gameStat.myTeam.length > 0 &&
            gameStat.enemyTeam &&
            gameStat.enemyTeam.length > 0) {

            const playerStatsIndex = gameStat.role.indexOf(playerRole);
            if (playerStatsIndex > -1) {
                result.laning.avgCreepScoreDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning
                        .avgCreepScoreDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgCreepScoreDifferenceCount.min10;
                result.laning.avgCreepScoreDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning
                        ?.avgCreepScoreDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgCreepScoreDifferenceCount.min15;

                result.laning.avgGoldDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning
                        ?.avgGoldDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgGoldDifferenceCount.min10;
                result.laning.avgGoldDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning
                        ?.avgGoldDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgGoldDifferenceCount.min15;

                result.laning.avgExpDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning?.avgExpDifferenceCount
                        .min10 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgExpDifferenceCount.min10;
                result.laning.avgExpDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning?.avgExpDifferenceCount
                        .min15 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgExpDifferenceCount.min15;

                result.laning.avgTimeSpentOutOfLaneSeconds.min10 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min10 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min10;
                result.laning.avgTimeSpentOutOfLaneSeconds.min15 +=
                    gameStat.myTeam[playerStatsIndex].top!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min15 -
                    gameStat.enemyTeam[playerStatsIndex].top!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min15;

                result.general.avgIsolatedDeathCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.general!.avgIsolatedDeathCount.min10;
                result.general.avgIsolatedDeathCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.general!.avgIsolatedDeathCount.min15;

                result.general.avgSoloKillCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.general!.avgSoloKillCount.min10;
                result.general.avgSoloKillCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.general!.avgSoloKillCount.min15;

                result.general.avgForwardPercent.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.general!.avgForwardPercent.min10;
                result.general.avgForwardPercent.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.general!.avgForwardPercent.min15;

                result.teamFightDamage!.team.topPercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.team.topPercent;
                result.teamFightDamage!.team.junglePercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.team.junglePercent;
                result.teamFightDamage!.team.middlePercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.team.middlePercent;
                result.teamFightDamage!.team.bottomPercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.team.bottomPercent;
                result.teamFightDamage!.team.supportPercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.team.supportPercent;

                result.teamFightDamage!.enemy.topPercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.enemy.topPercent;
                result.teamFightDamage!.enemy.junglePercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.enemy.junglePercent;
                result.teamFightDamage!.enemy.middlePercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.enemy.middlePercent;
                result.teamFightDamage!.enemy.bottomPercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.enemy.bottomPercent;
                result.teamFightDamage!.enemy.supportPercent += gameStat.myTeam[
                    playerStatsIndex
                ].top!.teamFightDamage!.enemy.supportPercent;

                result.vision.avgControlWardsBoughtCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.vision!.avgControlWardsBoughtCount.min10;
                result.vision.avgControlWardsBoughtCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].top!.vision!.avgControlWardsBoughtCount.min15;
            }
        }
    });

    const size = gameStats.length;

    if (size > 0) {
        result.laning.avgCreepScoreDifferenceCount.min10 /= size;
        result.laning.avgCreepScoreDifferenceCount.min15 /= size;

        result.laning.avgGoldDifferenceCount.min10 /= size;
        result.laning.avgGoldDifferenceCount.min15 /= size;

        result.laning.avgExpDifferenceCount.min10 /= size;
        result.laning.avgExpDifferenceCount.min15 /= size;

        result.laning.avgTimeSpentOutOfLaneSeconds.min10 /= size;
        result.laning.avgTimeSpentOutOfLaneSeconds.min15 /= size;

        result.general.avgIsolatedDeathCount.min10 /= size;
        result.general.avgIsolatedDeathCount.min15 /= size;

        result.general.avgSoloKillCount.min10 /= size;
        result.general.avgSoloKillCount.min15 /= size;

        result.general.avgForwardPercent.min10 /= size;
        result.general.avgForwardPercent.min15 /= size;

        result.teamFightDamage!.team.topPercent /= size;
        result.teamFightDamage!.team.junglePercent /= size;
        result.teamFightDamage!.team.middlePercent /= size;
        result.teamFightDamage!.team.bottomPercent /= size;
        result.teamFightDamage!.team.supportPercent /= size;

        result.teamFightDamage!.enemy.topPercent /= size;
        result.teamFightDamage!.enemy.junglePercent /= size;
        result.teamFightDamage!.enemy.middlePercent /= size;
        result.teamFightDamage!.enemy.bottomPercent /= size;
        result.teamFightDamage!.enemy.supportPercent /= size;

        result.vision.avgControlWardsBoughtCount.min10 /= size;
        result.vision.avgControlWardsBoughtCount.min15 /= size;
    }

    return result;
}

/**
 * Get a Middle player's information during given games.
 * @param gameStats[]: The game state info during given games.
 * @returns PlayerMiddleStatsModel
 */
function getMidPlayerStats(
    playerRole: PlayerRole,
    gameStats: GameStatsModel[],
): PlayerMiddleStatsModel {
    const result = new PlayerMiddleStatsModel();
    result.init();
    gameStats.forEach((gameStat: GameStatsModel) => {
        if (gameStat && gameStat.myTeam &&
            gameStat.myTeam.length > 0 &&
            gameStat.enemyTeam &&
            gameStat.enemyTeam.length > 0) {

            const playerStatsIndex = gameStat.role.indexOf(playerRole);
            if (playerStatsIndex > -1) {
                result.laning.avgCreepScoreDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgCreepScoreDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgCreepScoreDifferenceCount.min10;
                result.laning.avgCreepScoreDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgCreepScoreDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgCreepScoreDifferenceCount.min15;

                result.laning.avgGoldDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgGoldDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgGoldDifferenceCount.min10;
                result.laning.avgGoldDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgGoldDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgGoldDifferenceCount.min15;

                result.laning.avgExpDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgExpDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgExpDifferenceCount.min10;
                result.laning.avgExpDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgExpDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgExpDifferenceCount.min15;

                result.laning.avgTimeSpentOutOfLaneSeconds.min10 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min10 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min10;
                result.laning.avgTimeSpentOutOfLaneSeconds.min15 +=
                    gameStat.myTeam[playerStatsIndex].middle!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min15 -
                    gameStat.enemyTeam[playerStatsIndex].middle!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min15;

                result.general.avgIsolatedDeathCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.general!.avgIsolatedDeathCount.min10;
                result.general.avgIsolatedDeathCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.general!.avgIsolatedDeathCount.min15;

                result.general.avgSoloKillCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.general!.avgSoloKillCount.min10;
                result.general.avgSoloKillCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.general!.avgSoloKillCount.min15;

                result.general.avgForwardPercent.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.general!.avgForwardPercent.min10;
                result.general.avgForwardPercent.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.general!.avgForwardPercent.min15;

                result.teamFightDamage!.team.topPercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.team.topPercent;
                result.teamFightDamage!.team.junglePercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.team.junglePercent;
                result.teamFightDamage!.team.middlePercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.team.middlePercent;
                result.teamFightDamage!.team.bottomPercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.team.bottomPercent;
                result.teamFightDamage!.team.supportPercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.team.supportPercent;

                result.teamFightDamage!.enemy.topPercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.enemy.topPercent;
                result.teamFightDamage!.enemy.junglePercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.enemy.junglePercent;
                result.teamFightDamage!.enemy.middlePercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.enemy.middlePercent;
                result.teamFightDamage!.enemy.bottomPercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.enemy.bottomPercent;
                result.teamFightDamage!.enemy.supportPercent += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.teamFightDamage!.enemy.supportPercent;

                result.vision.avgControlWardsBoughtCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.vision!.avgControlWardsBoughtCount.min10;
                result.vision.avgControlWardsBoughtCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].middle!.vision!.avgControlWardsBoughtCount.min15;
            }
        }
    });

    const size = gameStats.length;

    if (size > 0) {
        result.laning.avgCreepScoreDifferenceCount.min10 /= size;
        result.laning.avgCreepScoreDifferenceCount.min15 /= size;

        result.laning.avgGoldDifferenceCount.min10 /= size;
        result.laning.avgGoldDifferenceCount.min15 /= size;

        result.laning.avgExpDifferenceCount.min10 /= size;
        result.laning.avgExpDifferenceCount.min15 /= size;

        result.laning.avgTimeSpentOutOfLaneSeconds.min10 /= size;
        result.laning.avgTimeSpentOutOfLaneSeconds.min15 /= size;

        result.general.avgIsolatedDeathCount.min10 /= size;
        result.general.avgIsolatedDeathCount.min15 /= size;

        result.general.avgSoloKillCount.min10 /= size;
        result.general.avgSoloKillCount.min15 /= size;

        result.general.avgForwardPercent.min10 /= size;
        result.general.avgForwardPercent.min15 /= size;

        result.teamFightDamage!.team.topPercent /= size;
        result.teamFightDamage!.team.junglePercent /= size;
        result.teamFightDamage!.team.middlePercent /= size;
        result.teamFightDamage!.team.bottomPercent /= size;
        result.teamFightDamage!.team.supportPercent /= size;

        result.teamFightDamage!.enemy.topPercent /= size;
        result.teamFightDamage!.enemy.junglePercent /= size;
        result.teamFightDamage!.enemy.middlePercent /= size;
        result.teamFightDamage!.enemy.bottomPercent /= size;
        result.teamFightDamage!.enemy.supportPercent /= size;

        result.vision.avgControlWardsBoughtCount.min10 /= size;
        result.vision.avgControlWardsBoughtCount.min15 /= size;
    }

    return result;
}

/**
 * Get a Bottom player's information during given games.
 * @param gameStats[]: The game state info during given games.
 * @returns PlayerBottomStatsModel
 */
function getBotPlayerStats(
    playerRole: PlayerRole,
    gameStats: GameStatsModel[],
): PlayerBottomStatsModel {
    const result = new PlayerBottomStatsModel();
    result.init();
    gameStats.forEach((gameStat: GameStatsModel) => {
        if (gameStat && gameStat.myTeam &&
            gameStat.myTeam.length > 0 &&
            gameStat.enemyTeam &&
            gameStat.enemyTeam.length > 0) {

            const playerStatsIndex = gameStat.role.indexOf(playerRole);
            if (playerStatsIndex > -1) {
                result.laning.avgCreepScoreDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgCreepScoreDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgCreepScoreDifferenceCount.min10;
                result.laning.avgCreepScoreDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgCreepScoreDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgCreepScoreDifferenceCount.min15;

                result.laning.avgGoldDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgGoldDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgGoldDifferenceCount.min10;
                result.laning.avgGoldDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgGoldDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgGoldDifferenceCount.min15;

                result.laning.avgExpDifferenceCount.min10 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgExpDifferenceCount.min10 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgExpDifferenceCount.min10;
                result.laning.avgExpDifferenceCount.min15 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgExpDifferenceCount.min15 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgExpDifferenceCount.min15;

                result.laning.avgTimeSpentOutOfLaneSeconds.min10 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min10 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min10;
                result.laning.avgTimeSpentOutOfLaneSeconds.min15 +=
                    gameStat.myTeam[playerStatsIndex].bottom!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min15 -
                    gameStat.enemyTeam[playerStatsIndex].bottom!.laning
                        ?.avgTimeSpentOutOfLaneSeconds.min15;

                result.general.avgIsolatedDeathCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.general!.avgIsolatedDeathCount.min10;
                result.general.avgIsolatedDeathCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.general!.avgIsolatedDeathCount.min15;

                result.general.avgSoloKillCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.general!.avgSoloKillCount.min10;
                result.general.avgSoloKillCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.general!.avgSoloKillCount.min15;

                result.general.avgForwardPercent.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.general!.avgForwardPercent.min10;
                result.general.avgForwardPercent.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.general!.avgForwardPercent.min15;

                result.teamFightDamage!.team.topPercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.team.topPercent;
                result.teamFightDamage!.team.junglePercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.team.junglePercent;
                result.teamFightDamage!.team.middlePercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.team.middlePercent;
                result.teamFightDamage!.team.bottomPercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.team.bottomPercent;
                result.teamFightDamage!.team.supportPercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.team.supportPercent;

                result.teamFightDamage!.enemy.topPercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.enemy.topPercent;
                result.teamFightDamage!.enemy.junglePercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.enemy.junglePercent;
                result.teamFightDamage!.enemy.middlePercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.enemy.middlePercent;
                result.teamFightDamage!.enemy.bottomPercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.enemy.bottomPercent;
                result.teamFightDamage!.enemy.supportPercent += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.teamFightDamage!.enemy.supportPercent;

                result.vision.avgControlWardsBoughtCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.vision!.avgControlWardsBoughtCount.min10;
                result.vision.avgControlWardsBoughtCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].bottom!.vision!.avgControlWardsBoughtCount.min15;
            }
        }
    });

    const size = gameStats.length;

    if (size > 0) {
        result.laning.avgCreepScoreDifferenceCount.min10 /= size;
        result.laning.avgCreepScoreDifferenceCount.min15 /= size;

        result.laning.avgGoldDifferenceCount.min10 /= size;
        result.laning.avgGoldDifferenceCount.min15 /= size;

        result.laning.avgExpDifferenceCount.min10 /= size;
        result.laning.avgExpDifferenceCount.min15 /= size;

        result.laning.avgTimeSpentOutOfLaneSeconds.min10 /= size;
        result.laning.avgTimeSpentOutOfLaneSeconds.min15 /= size;

        result.general.avgIsolatedDeathCount.min10 /= size;
        result.general.avgIsolatedDeathCount.min15 /= size;

        result.general.avgSoloKillCount.min10 /= size;
        result.general.avgSoloKillCount.min15 /= size;

        result.general.avgForwardPercent.min10 /= size;
        result.general.avgForwardPercent.min15 /= size;

        result.teamFightDamage!.team.topPercent /= size;
        result.teamFightDamage!.team.junglePercent /= size;
        result.teamFightDamage!.team.middlePercent /= size;
        result.teamFightDamage!.team.bottomPercent /= size;
        result.teamFightDamage!.team.supportPercent /= size;

        result.teamFightDamage!.enemy.topPercent /= size;
        result.teamFightDamage!.enemy.junglePercent /= size;
        result.teamFightDamage!.enemy.middlePercent /= size;
        result.teamFightDamage!.enemy.bottomPercent /= size;
        result.teamFightDamage!.enemy.supportPercent /= size;

        result.vision.avgControlWardsBoughtCount.min10 /= size;
        result.vision.avgControlWardsBoughtCount.min15 /= size;
    }

    return result;
}

/**
 * Get a Jungle player's information during given games.
 * @param gameStats[]: The game state info during given games.
 * @returns PlayerJunglerStatsModel
 */
function getJunglePlayerStats(
    playerRole: PlayerRole,
    gameStats: GameStatsModel[],
): PlayerJunglerStatsModel {
    const result = new PlayerJunglerStatsModel();
    result.init();
    gameStats.forEach((gameStat: GameStatsModel) => {
    if (gameStat && gameStat.myTeam &&
            gameStat.myTeam.length > 0 &&
            gameStat.enemyTeam &&
            gameStat.enemyTeam.length > 0) {

            const playerStatsIndex = gameStat.role.indexOf(playerRole);
            if (playerStatsIndex > -1) {
                result.jungling.avgCampsTakenCount.min10.count += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgCampsTakenCount.min10.count;
                result.jungling.avgCampsTakenCount.min10.total += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgCampsTakenCount.min10.total;
                result.jungling.avgCampsTakenCount.min15.count += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgCampsTakenCount.min15.count;
                result.jungling.avgCampsTakenCount.min15.total += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgCampsTakenCount.min15.total;

                result.jungling.avgScuttlesPercent.min10.count += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgScuttlesPercent.min10.count;
                result.jungling.avgScuttlesPercent.min10.total += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgScuttlesPercent.min10.total;
                result.jungling.avgCampsTakenCount.min15.count += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgCampsTakenCount.min15.count;
                result.jungling.avgCampsTakenCount.min15.total += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgCampsTakenCount.min15.total;

                result.jungling.avgTimesRevealedCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler!.jungling?.avgTimesRevealedCount.min10;
                result.jungling.avgTimesRevealedCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler!.jungling?.avgTimesRevealedCount.min15;

                result.jungling.avgDurationOfTimeRevealedSeconds.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgDurationOfTimeRevealedSeconds.min10;
                result.jungling.avgDurationOfTimeRevealedSeconds.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.jungling!.avgDurationOfTimeRevealedSeconds.min15;

                result.general.avgIsolatedDeathCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.general!.avgIsolatedDeathCount.min10;
                result.general.avgIsolatedDeathCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler?.general!.avgIsolatedDeathCount.min15;

                result.general.avgSoloKillCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler!.general!.avgSoloKillCount.min10;
                result.general.avgSoloKillCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler!.general!.avgSoloKillCount.min15;

                result.general.avgForwardPercent.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler!.general!.avgForwardPercent.min10;
                result.general.avgForwardPercent.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].jungler!.general!.avgForwardPercent.min15;

                const laneInteraction = gameStat.myTeam[playerStatsIndex].jungler!.laneInteraction!;
                result.laneInteraction.avgLaneProximityTimeInSecondsPre10min.add(laneInteraction.avgLaneProximityTimeInSecondsPre10min);
                result.laneInteraction.avgLaneProximityTimeInSecondsPre15min.add(laneInteraction.avgLaneProximityTimeInSecondsPre15min);

                result.laneInteraction.gankAttemptCount.add(laneInteraction.gankAttemptCount);
                result.laneInteraction.gankAttemptSuccessCount.add(laneInteraction.gankAttemptSuccessCount);

                result.laneInteraction.firstGankCountPerLane.add(laneInteraction.firstGankCountPerLane);
                result.laneInteraction.firstGankSuccessCountPerLane.add(laneInteraction.firstGankSuccessCountPerLane);

                result.laneInteraction.secondGankCountPerLane.add(laneInteraction.secondGankCountPerLane);
                result.laneInteraction.secondGankSuccessCountPerLane.add(laneInteraction.secondGankSuccessCountPerLane);

                result.laneInteraction.thirdGankCountPerLane.add(laneInteraction.thirdGankCountPerLane);
                result.laneInteraction.thirdGankSuccessCountPerLane.add(laneInteraction.thirdGankSuccessCountPerLane);
            }
        }
    });

    const size = gameStats.length;

    if (size > 0) {
        result.jungling.avgCampsTakenCount.min10.count /= size;
        result.jungling.avgCampsTakenCount.min10.total /= size;
        result.jungling.avgCampsTakenCount.min15.count /= size;
        result.jungling.avgCampsTakenCount.min15.total /= size;

        result.jungling.avgScuttlesPercent.min10.count /= size;
        result.jungling.avgScuttlesPercent.min10.total /= size;
        result.jungling.avgCampsTakenCount.min15.count /= size;
        result.jungling.avgCampsTakenCount.min15.total /= size;

        result.jungling.avgTimesRevealedCount.min10 /= size;
        result.jungling.avgTimesRevealedCount.min15 /= size;

        result.jungling.avgDurationOfTimeRevealedSeconds.min10 /= size;
        result.jungling.avgDurationOfTimeRevealedSeconds.min15 /= size;

        result.general.avgIsolatedDeathCount.min10 /= size;
        result.general.avgIsolatedDeathCount.min15 /= size;

        result.general.avgSoloKillCount.min10 /= size;
        result.general.avgSoloKillCount.min15 /= size;

        result.general.avgForwardPercent.min10 /= size;
        result.general.avgForwardPercent.min15 /= size;

        result.laneInteraction.avgLaneProximityTimeInSecondsPre10min.top /= size;
        result.laneInteraction.avgLaneProximityTimeInSecondsPre10min.middle /= size;
        result.laneInteraction.avgLaneProximityTimeInSecondsPre10min.bottom /= size;

        result.laneInteraction.avgLaneProximityTimeInSecondsPre15min.top /= size;
        result.laneInteraction.avgLaneProximityTimeInSecondsPre15min.middle /= size;
        result.laneInteraction.avgLaneProximityTimeInSecondsPre15min.bottom /= size;
    }

    return result;
}

/**
 * Get a Support player's information during given games.
 * @param gameStats[]: The game state info during given games.
 * @returns PlayerSupportStatsModel
 */
function getSupportPlayerStats(
    playerRole: PlayerRole,
    gameStats: GameStatsModel[],
): PlayerSupportStatsModel {
    const result = new PlayerSupportStatsModel();
    result.init();
    gameStats.forEach((gameStat: GameStatsModel) => {
    if (gameStat && gameStat.myTeam &&
            gameStat.myTeam.length > 0 &&
            gameStat.enemyTeam &&
            gameStat.enemyTeam.length > 0) {

            const playerStatsIndex = gameStat.role.indexOf(playerRole);
            if (playerStatsIndex > -1) {
                result.supportItems = gameStat.myTeam[
                    playerStatsIndex
                ].support!.supportItems;

                result.vision.avgWardsPlacedCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.avgWardsPlacedCount.min10;
                result.vision.avgWardsPlacedCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.avgWardsPlacedCount.min15;

                result.vision.avgWardsRevealedCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.avgWardsRevealedCount.min10;
                result.vision.avgWardsRevealedCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.avgWardsRevealedCount.min15;

                result.vision.sweeperEfficiency.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.sweeperEfficiency.min10;
                result.vision.sweeperEfficiency.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.sweeperEfficiency.min15;

                result.vision.avgControlWardsPerMinCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.avgControlWardsPerMinCount.min10;
                result.vision.avgControlWardsPerMinCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.vision!.avgControlWardsPerMinCount.min15;

                result.general.avgSoloKillCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.general!.avgSoloKillCount.min10;
                result.general.avgSoloKillCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.general!.avgSoloKillCount.min15;

                result.general.avgForwardPercent.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.general!.avgForwardPercent.min10;
                result.general.avgForwardPercent.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.general!.avgForwardPercent.min15;

                result.general.avgIsolatedDeathCount.min10 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.general!.avgIsolatedDeathCount.min10;
                result.general.avgIsolatedDeathCount.min15 += gameStat.myTeam[
                    playerStatsIndex
                ].support!.general!.avgIsolatedDeathCount.min15;
            }
        }
    });

    const size = gameStats.length;

    // result.supportItems /= size;
    if (size > 0) {
        result.vision.avgWardsPlacedCount.min10 /= size;
        result.vision.avgWardsPlacedCount.min15 /= size;

        result.vision.avgWardsRevealedCount.min10 /= size;
        result.vision.avgWardsRevealedCount.min15 /= size;

        result.vision.sweeperEfficiency.min10 /= size;
        result.vision.sweeperEfficiency.min15 /= size;

        result.vision.avgControlWardsPerMinCount.min10 /= size;
        result.vision.avgControlWardsPerMinCount.min15 /= size;
    }

    return result;
}

/**
 * Calculate & Return Stats for the given player with specific role.
 * @param playerRole The role of the player.
 * @param lastGames The filtered game array
 * @returns PlayerStatsModel
 */
export function getPlayerStats(
    playerRole: PlayerRole,
    lastGames: GameStatsModel[],
): PlayerStatsModel {
    const playerInfo = new PlayerStatsModel();
    // return playerInfo
    switch (playerRole) {
        case PlayerRole.Top: // Top
            playerInfo.top = getTopPlayerStats(playerRole, lastGames);
            break;
        case PlayerRole.Middle: // Middle
            playerInfo.middle = getMidPlayerStats(playerRole, lastGames);
            break;
        case PlayerRole.Bottom: // Bottom
            playerInfo.bottom = getBotPlayerStats(playerRole, lastGames);
            break;
        case PlayerRole.Jungler: // Jungle
            playerInfo.jungler = getJunglePlayerStats(playerRole, lastGames);
            break;
        case PlayerRole.Support: // Support
            playerInfo.support = getSupportPlayerStats(playerRole, lastGames);
            break;
        default:
            // Unknown
            // playerInfo.role = PlayerRole.Unknown;
            break;
    }
    return playerInfo;
}

/**
 * Provides methods to calculate player statistics.
 */
export const PlayerStatsUtils = {
    getPlayerStats,
};
