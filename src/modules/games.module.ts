import { Module } from '@nestjs/common';
import { GamesController } from '../controllers';
import { AllDataModule } from '../data-modules';

@Module({
  imports: [AllDataModule],
  controllers: [GamesController],
})
export class GamesModule {

}