import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GameBannedChampionEntity,
  GameEntity,
  GameFileEntity,
  GamePatchEntity,
  GamePlayerEntity,
  GameSplitEntity,
  PlayerEntity,
  PlayerFollowerEntity,
  TeamEntity,
  TeamMemberEntity,
  UserEntity,
  UserSummonerEntity,
  MatchStatsEntity,
} from '../data-entities';
import {
  AuthUserFollowDataService,
  AuthUserGamesDataService,
  GamesDataService,
  PlayersDataService,
  ProbuildsDataService,
  TeamsDataService,
  UsersDataService,
} from '../data-services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GamePatchEntity,
      GameSplitEntity,

      GameEntity,
      GameFileEntity,
      GamePlayerEntity,
      GameBannedChampionEntity,
      MatchStatsEntity,

      PlayerEntity,
      PlayerFollowerEntity,
      TeamEntity,
      TeamMemberEntity,

      UserEntity,
      UserSummonerEntity,
    ]),
  ],
  providers: [
    AuthUserGamesDataService,
    AuthUserFollowDataService,
    GamesDataService,
    PlayersDataService,
    TeamsDataService,
    UsersDataService,
    ProbuildsDataService,
  ],
  exports: [
    AuthUserGamesDataService,
    AuthUserFollowDataService,
    GamesDataService,
    PlayersDataService,
    TeamsDataService,
    UsersDataService,
    ProbuildsDataService,
  ],
})
export class AllDataModule {}
