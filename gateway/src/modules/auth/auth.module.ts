import { Module, Global } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { ClientsModule } from '../clients/clients.module';

@Global()
@Module({
  imports: [ConfigModule, ClientsModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
