import { Module } from '@nestjs/common';
import { AuthUserFollowController } from '../controllers';
import { AllDataModule } from '../data-modules';

@Module({
  imports: [AllDataModule],
  controllers: [AuthUserFollowController],
})
export class AuthUserFollowModule {

}