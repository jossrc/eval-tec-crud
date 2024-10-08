import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './entities/client.entity';

@Module({
  controllers: [ClientController],
  providers: [ClientService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Client.name,
        schema: ClientSchema,
      },
    ]),
  ],
  exports: [ClientModule, MongooseModule],
})
export class ClientModule {}
