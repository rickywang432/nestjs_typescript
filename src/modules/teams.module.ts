import { Module } from '@nestjs/common';
import { TeamsController } from '../controllers';
import { AllDataModule } from '../data-modules';

@Module({
  imports: [AllDataModule],
  controllers: [TeamsController],
})
export class TeamsModule {

}