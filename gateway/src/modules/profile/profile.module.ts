import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProfileController } from './profile.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { ClientsModule } from '../clients/clients.module';
@Module({
  imports: [
    ConfigModule,
    ClientsModule,
    CacheModule.register({
      ttl: 60 * 60 * 24,
    }),
  ],
  controllers: [ProfileController],
  providers: [],
})
export class ProfileModule {}
