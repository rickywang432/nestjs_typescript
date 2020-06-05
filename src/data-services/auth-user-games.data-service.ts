import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Any,
  DeepPartial,
  EntityManager,
  getConnection,
  Repository,
} from 'typeorm';
import {
  GameBannedChampionEntity,
  GameEntity,
  GameFileEntity,
  GameFileS3Info,
  GamePatchEntity,
  GamePlayerEntity,
  PlayerEntity,
  TeamMemberEntity,
  MatchStatsEntity,
} from '../data-entities';
import {
  GameFileCompressionMethod,
  GameFileFormat,
  GameFileModel,
  GameFileType,
  GameFileUpdateModel,
  GameFileUploadStatus,
  GameTeamSide,
  GameType,
  GameUploadInfoModel,
  GameUploadTeamInfoModel,
} from '../models';
import { DbModificationOperationResult } from './db-modification-operation-result';
import { TeamsDataService } from './teams.data-service';

/**
 * Provides access to game data.
 */
@Injectable()
export class AuthUserGamesDataService {
  constructor(
    @InjectRepository(GameFileEntity)
    private readonly gameFileRepository: Repository<GameFileEntity>,
    private teamsDataService: TeamsDataService,
  ) { }

  /* #region Info */

  /**
   * Returns information about all files related to a game.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.
   * @param model Game information.
   */
  async updateGameInfo(
    userId: number,
    gameUid: string,
    model: GameUploadInfoModel,
  ): Promise<void> {
    // CAUTION: The "save" method does not work correctly when the primary key includes multiple columns
    // https://github.com/typeorm/typeorm/issues/2099

    await getConnection().transaction(async tran => {
      // Save the patch number to a list so that can be provided to the FE for filtering
      await tran.getRepository(GamePatchEntity).save({ name: model.patchId });

      const gameRepository = tran.getRepository(GameEntity);

      // CAUTION: The primary key of a row MUST be specified when calling the "Save" method if there are other unique constraints
      // in order to avoid conflict.

      const dbGameUid = gameUid.toLowerCase();
      let gameDbId: number;

      const dbData: DeepPartial<GameEntity> = {
        updateUserId: userId,
        updateTime: new Date(),
        uid: dbGameUid,
        type: model.gameType,
        regionId: model.regionId.toLowerCase(), // Ex. "na1", "esportstmnt02"
        patchId: model.patchId.toLowerCase(), // Ex. "10.1"
        startTime: model.gameStart,
        endTime: model.gameEnd,
        redTeamInfo: model.redTeam,
        blueTeamInfo: model.blueTeam,
        winnerTeamSide: model.winnerTeamSide,
        wardsInfo: model.wards,
      };

      const updateResult = await gameRepository.update(
        { uid: dbGameUid },
        dbData,
      );

      if (updateResult.getAffectedRows() > 0) {
        gameDbId = (await gameRepository.findOne({
          select: ['id'],
          where: { uid: dbGameUid },
        }))!.id;
      } else {
        const insertResult = await gameRepository.insert(dbData);

        gameDbId = insertResult.identifiers[0].id;
      }

      const redTeamDbId = await this.saveTeam(
        gameDbId,
        model.gameType,
        GameTeamSide.Red,
        model.redTeam,
        tran,
      );

      const blueTeamDbId = await this.saveTeam(
        gameDbId,
        model.gameType,
        GameTeamSide.Blue,
        model.blueTeam,
        tran,
      );

      const redTeamMatchStats = this.teamsDataService.getTeamMatchStats(
        model.redTeam,
      );
      const blueTeamMatchStats = this.teamsDataService.getTeamMatchStats(
        model.blueTeam,
      );

      const matchStatsRepository = tran.getRepository(MatchStatsEntity);
      await matchStatsRepository.insert({
        gameId: gameDbId,
        redTeamSoloKillsCount: redTeamMatchStats.soloKillsCount,
        blueTeamSoloKillsCount: blueTeamMatchStats.soloKillsCount,
        redTeamIsolatedDeathsCount: redTeamMatchStats.isoDeathsCount,
        blueTeamIsolatedDeathsCount: blueTeamMatchStats.isoDeathsCount,
        redTeamGoldDiffPre15: redTeamMatchStats.goldDiffPre15,
        blueTeamGoldDiffPre15: blueTeamMatchStats.goldDiffPre15,
        redTeamGoldDiffPost15: redTeamMatchStats.goldDiffPost15,
        blueTeamGoldDiffPost15: blueTeamMatchStats.goldDiffPost15,
        redTeamCsDiffPre15: redTeamMatchStats.csDiffPre15,
        blueTeamCsDiffPre15: blueTeamMatchStats.csDiffPre15,
        redTeamCsDiffPost15: redTeamMatchStats.csDiffPost15,
        blueTeamCsDiffPost15: blueTeamMatchStats.csDiffPost15,
        redTeamDragonSecuredPercent: redTeamMatchStats.dragonSecuredPercent,
        blueTeamDragonSecuredPercent: blueTeamMatchStats.dragonSecuredPercent,
        redTeamBaronSecuredPercent: redTeamMatchStats.baronSecuredPercent,
        blueTeamBaronSecuredPercent: blueTeamMatchStats.baronSecuredPercent,
      });

      // Save the IDs of the team
      gameRepository.update(gameDbId, {
        redTeamId: redTeamDbId,
        blueTeamId: blueTeamDbId,
      });
    });
  }

  /**
   * Returns the ID of a team who participated in a game.
   * @param model Team information.
   * @param tran TRansaction.
   * @returns The ID of the team or `undefined` if the members do not belong to any team.
   */
  async getTeamId(
    model: GameUploadTeamInfoModel,
    tran: EntityManager,
  ): Promise<number | undefined> {
    const playerNameIds = model.players.map(x =>
      x.summonerIdentity.name.toLowerCase(),
    );
    const teamMemberList = await tran.getRepository(TeamMemberEntity).find({
      select: ['teamId'],
      where: {
        nameId: Any(playerNameIds),
      },
    });

    if (teamMemberList.length > 0) {
      // Select the team that has the most members (in order to account for stand in players)
      const teamIdCountDict: { [teamId: number]: number | undefined } = {};

      let maxCount: number | undefined;
      let maxTeamId: number | undefined;

      for (const item of teamMemberList) {
        let newValue: number;
        teamIdCountDict[item.teamId] = newValue =
          (teamIdCountDict[item.teamId] ?? 0) + 1;

        if (maxCount == undefined || maxCount < newValue) {
          maxCount = newValue;
          maxTeamId = item.teamId;
        }
      }

      return maxTeamId;
    } else {
      return undefined;
    }
  }

  /**
   * Saves the information about a team who participated in a game.
   * @returns The ID of the team (if any).
   */
  async saveTeam(
    gameDbId: number,
    gameType: GameType,
    teamSide: GameTeamSide,
    model: GameUploadTeamInfoModel,
    tran: EntityManager,
  ): Promise<number | undefined> {
    let teamDbId: number | undefined;

    const playerRepository = tran.getRepository(PlayerEntity);
    const gamePlayerRepository = tran.getRepository(GamePlayerEntity);

    if (gameType == GameType.Competitive || gameType == GameType.Scrim) {
      // Create a record for the team if possible

      teamDbId = await this.getTeamId(model, tran);

      /* // DEPRECATED
            const teamName = this.determineTeamName(model);
            if (teamName != undefined) {
                const teamNameId = teamName.toLowerCase();
                const teamRepository = tran.getRepository(TeamEntity);
                const record = await teamRepository.findOne({ select: ['id'], where: { nameId: teamNameId } });
                if (record == undefined) {
                    const result = await teamRepository.insert({
                        name: teamName,
                        nameId: teamNameId,
                    });
                    teamDbId = result.identifiers[0].id;
                } else {
                    teamDbId = record.id;
                }
            } else {
                teamDbId = undefined;
            }
            */
    } else {
      teamDbId = undefined;
    }

    for (const player of model.players) {
      let playerDbId: number;

      const nameId = player.summonerIdentity.name.toLocaleLowerCase();

      const record = await playerRepository.findOne({
        select: ['id'],
        where: {
          // CAUTION: It is possible that a player moves to another team and their name changes, however, their ID remain the same.
          // Therefore, in order to keep the name of the player consistent with their new team (e.g. "TSM John" to "LLP John") as well as
          // to keep the link between the player and the corresponding "TeamMember" record a new "Player" record must be created.
          nameId: nameId,
        },
      });

      if (record == undefined) {
        const result = await playerRepository.insert({
          name: player.summonerIdentity.name,
          nameId: nameId,
          summonerName: player.summonerIdentity.name,
        });

        playerDbId = result.identifiers[0].id;
      } else {
        playerDbId = record.id;
      }

      if (
        (await gamePlayerRepository.count({
          where: { gameId: gameDbId, summonerId: player.summonerIdentity.id },
        })) == 0
      ) {
        await gamePlayerRepository.insert({
          gameId: gameDbId,
          summonerId: player.summonerIdentity.id,
          championId: player.championId,
          teamSide: teamSide,
          role: player.role,
          playerId: playerDbId,
          teamId: teamDbId,
        });
      }
    }

    if (model.bannedChampionIds != undefined) {
      const bannedChampionRepository = tran.getRepository(
        GameBannedChampionEntity,
      );

      for (const championId of model.bannedChampionIds) {
        if (
          (await bannedChampionRepository.count({
            where: { gameId: gameDbId, championId: championId },
          })) == 0
        ) {
          await bannedChampionRepository.insert({
            gameId: gameDbId,
            championId: championId,
            teamSide: teamSide,
            teamId: teamDbId,
          });
        }
      }
    }

    return teamDbId;
  }

  // DEPRECATED
  // /**
  //  * Determines the name of a team from the names of the summoners of the team's members/
  //  * @param model Information about a team.
  //  * @returns The name of the team or `undefined` if the name of the team cannot be determined.
  //  */
  // determineTeamName(model: GameUploadTeamInfoModel): string | undefined {
  //     if (model.players.length == 0) {
  //         return undefined;
  //     }

  //     // Extract the name of the team from the name of the summoner of the first player
  //     const teamName = this.extractTeamNameFromSummonerName(model.players[0].summonerIdentity.name);

  //     if (teamName == undefined) {
  //         return
  //     }

  //     for (const item of model.players) {
  //         const itemTeamName = this.extractTeamNameFromSummonerName(item.summonerIdentity.name);
  //         if (itemTeamName?.toLowerCase() == teamName.toLowerCase()) {
  //             // The name matches
  //         } else {
  //             // The name is not the same for all players of the team
  //             return undefined;
  //         }
  //     }

  //     return teamName;
  // }

  // /**
  //  * Extracts the name of a team from the name of a summoner.
  //  * @param summonerName A summoner name.
  //  * @returns The name of the team or `undefined` if the name of the team cannot be determined.
  //  */
  // extractTeamNameFromSummonerName(summonerName: string): string | undefined {
  //     const parts = summonerName.split(/[ _-]/g, 2);

  //     return parts.length >= 2 && parts[0].length > 0 ? parts[0] : undefined;
  // }

  /* #endregion Info */

  /* #region Files */

  /**
   * Returns information about all files related to a game.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.
   */
  async getAllFiles(userId: number, gameUid: string): Promise<GameFileModel[]> {
    const dbList = await this.gameFileRepository.find({
      where: { userId: userId, gameUid: gameUid.toLowerCase() },
    });

    return dbList.map(
      item =>
        new GameFileModel({
          id: item.id,
          type: item.type,
          format: item.format,
          compressionMethod: item.compressionMethod,
          metadata: item.metadata,
          uploadStatus: item.uploadStatus,
        }),
    );
  }

  /**
   * Returns information about a file related to a game.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.
   * @param type The type of the file.
   */
  async getFile(
    userId: number,
    gameUid: string,
    type: GameFileType,
  ): Promise<GameFileModel | undefined> {
    const dbItem = await this.gameFileRepository.findOne({
      where: { userId: userId, gameUid: gameUid.toLowerCase(), type: type },
    });

    if (dbItem) {
      return new GameFileModel({
        id: dbItem.id,
        type: dbItem.type,
        format: dbItem.format,
        compressionMethod: dbItem.compressionMethod,
        metadata: dbItem.metadata,
        uploadStatus: dbItem.uploadStatus,
      });
    } else {
      return undefined;
    }
  }

  /**
   * Creates a new game-related file.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.
   * @param type The type of the file.
   * @param model Data.
   * @returns `true` on success; `false` if a file of specified type already exists for the game for the specified user.
   * @description CAUTION There can be only one file for per game per type per user (i.e. the tuple <game, user, file-type> is unique).
   */
  async createFile(
    userId: number,
    gameUid: string,
    type: GameFileType,
    model: GameFileUpdateModel,
  ): Promise<boolean> {
    const exists =
      (await this.gameFileRepository.count({
        where: {
          userId: userId,
          gameUid: gameUid.toLowerCase(),
          type: type,
        },
      })) > 0;

    if (exists) {
      return false;
    }

    await this.gameFileRepository.insert({
      userId: userId,
      gameUid: gameUid.toLowerCase(),
      type: type,
      uploadStartTime: new Date(),
      uploadStatus: GameFileUploadStatus.InProgress,

      format: model.format ?? GameFileFormat.Default,
      compressionMethod:
        model.compressionMethod ?? GameFileCompressionMethod.Default,
      metadata: model.metadata,
      s3Info: {
        fileNameExtension: model.fileNameExtension,
        mimeContentType: model.mimeContentType,
      },
    });

    return true;
  }

  /**
   * Returns the S3-related info of a game-related file.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.
   * @param type The type of the file.
   * @returns The S3-related info or `undefined` if the file does no exist.
   */
  async getFileS3Info(
    userId: number,
    gameUid: string,
    type: GameFileType,
  ): Promise<
    { uploadStatus: GameFileUploadStatus; s3Info: GameFileS3Info } | undefined
  > {
    const dbResult = await this.gameFileRepository.findOne({
      where: {
        userId: userId,
        gameUid: gameUid.toLowerCase(),
        type: type,
      },
      select: ['s3Info', 'uploadStatus'],
    });

    return dbResult == undefined
      ? undefined
      : { uploadStatus: dbResult.uploadStatus, s3Info: dbResult.s3Info };
  }

  /**
   * Updates the S3-related info of a game-related file.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.
   * @param type The type of the file.
   * @param model Data.
   * @returns `true` on success; `false` if the file does not exists or its upload is complete and S3 data cannot be changed.
   */
  async updateFileS3Info(
    userId: number,
    gameUid: string,
    type: GameFileType,
    model: GameFileS3Info,
  ): Promise<boolean> {
    const result = await this.gameFileRepository.update(
      {
        userId: userId,
        gameUid: gameUid.toLowerCase(),
        type: type,
        uploadStatus: GameFileUploadStatus.InProgress,
      },
      {
        s3Info: model,
      },
    );

    return result.getAffectedRows() > 0;
  }

  /**
   * Marks the upload of a game-related file as complete.
   * @param userId The ID of the authenticated user.
   * @param gameUid The unique ID of the game.c
   * @param type The type of the file.
   * @returns {DbModificationOperationResult} {@link DbModificationOperationResult.InvalidOperation} if the upload of the file is already marked as complete.
   */
  async completeFileUpload(
    userId: number,
    gameUid: string,
    type: GameFileType,
  ): Promise<DbModificationOperationResult> {
    const result = await this.gameFileRepository.update(
      {
        userId: userId,
        gameUid: gameUid.toLowerCase(),
        type: type,
        uploadStatus: GameFileUploadStatus.InProgress,
      },
      {
        uploadEndTime: new Date(),
        uploadStatus: GameFileUploadStatus.Complete,
      },
    );

    if (result.getAffectedRows() > 0) {
      return DbModificationOperationResult.Success;
    } else {
      // Return success if the upload is already complete
      const isComplete =
        (await this.gameFileRepository.count({
          where: {
            userId: userId,
            gameUid: gameUid.toLowerCase(),
            type: type,
            status: GameFileUploadStatus.Complete,
          },
        })) > 0;

      return isComplete
        ? DbModificationOperationResult.InvalidOperation
        : DbModificationOperationResult.NotFound;
    }
  }

  /* #endregion */
}
