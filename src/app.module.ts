import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './app.config';
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
} from './data-entities';
import {
  AuthModule,
  GamesModule,
  AuthUserGamesModule,
  PlayersModule,
  TeamsModule,
  AuthUserFollowModule,
  ProbuildsModule,
} from './modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.pass,
      database: config.database.name,
      // keepConnectionAlive: true,
      // timezone: 'Z', // Use UTC
      // debug: config.environment == 'development',
      // trace: true,
      logging: config.environment === 'development' ? 'all' : ['warn', 'error'],
      logger:
        config.environment === 'development' ? 'advanced-console' : 'debug',
      entities: [
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
      ],
      synchronize: false,
    }),
    AuthModule,
    AuthUserGamesModule,
    AuthUserFollowModule,
    GamesModule,
    PlayersModule,
    TeamsModule,
    ProbuildsModule,
  ],
})
export class AppModule {}
