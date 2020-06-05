import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HttpBearerAuthStrategy } from '../security';
import { AllDataModule } from '../data-modules';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'bearer', property: 'user', session: false }),
        AllDataModule,
    ],
    providers: [HttpBearerAuthStrategy],
    exports: [HttpBearerAuthStrategy],
})
export class AuthModule { }
