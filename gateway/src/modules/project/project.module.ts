import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { ProjectController } from './project.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ClientsModule, ConfigModule],
  controllers: [ProjectController],
})
export class ProjectModule {}
