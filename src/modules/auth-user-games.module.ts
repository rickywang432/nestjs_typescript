import { Module } from '@nestjs/common';
import { AuthUserGamesController } from '../controllers';
import { AllDataModule } from '../data-modules';

@Module({
  imports: [AllDataModule],
  controllers: [AuthUserGamesController],
})
export class AuthUserGamesModule {

}