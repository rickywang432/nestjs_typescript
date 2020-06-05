import { Module } from '@nestjs/common';
import { PlayersController } from '../controllers';
import { AllDataModule } from '../data-modules';

@Module({
  imports: [AllDataModule],
  controllers: [PlayersController],
})
export class PlayersModule {

}