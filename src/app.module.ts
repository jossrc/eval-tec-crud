import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { ClientModule } from './client/client.module';
import { CommonModule } from './common/common.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    ClientModule,
    CommonModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
