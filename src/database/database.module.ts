import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { subscriptionSchema } from './schemas/subscription.schema';
import { subscriptionDatabaseService } from './services/subscription.service';
import { repositorySHADatabaseService } from './services/repositorySHA.service';
import { repositorySHASchema } from './schemas/repositorySHA.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'Subscription', schema: subscriptionSchema },
      { name: 'RepositorySHA', schema: repositorySHASchema },
    ]),
  ],
  providers: [subscriptionDatabaseService, repositorySHADatabaseService],
  exports: [subscriptionDatabaseService, repositorySHADatabaseService],
})
export class DatabaseModule {}
