import { Module } from '@nestjs/common';
import { ProbuildsController } from '../controllers';
import { AllDataModule } from '../data-modules';

@Module({
    imports: [AllDataModule],
    controllers: [ProbuildsController],
})
export class ProbuildsModule {

}
