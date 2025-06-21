import { Controller, OnApplicationBootstrap } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmDto } from './dto/confirm-code.dto';
import { RpcException } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { LoginDto, LoginResponseDto, RefreshDto } from './dto/login.dto';
import {
  ConfirmRegistrationCommand,
  ConfirmResetPasswordCommand,
  LoginCommand,
  RefreshCommand,
  RegisterCommand,
  ResetPasswordCommand,
} from './commands';
import { SetNewPasswordCommand } from './commands/set-new-password/set-new-password.command';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly logger: LokiLoggerService,
  ) {}

  onApplicationBootstrap() {
    this.logger.info('Subscribing to auth-service.register');
    this.logger.info('CommandBus initialized successfully');
  }

  @MessagePattern('auth-service.login')
  async login(@Payload() dto: LoginDto) {
    try {
      const result = await this.commandBus.execute(
        new LoginCommand(dto.email, dto.password),
      );
      return result as LoginResponseDto;
    } catch (error: any) {
      this.logger.error('Login failed', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('auth-service.refresh')
  async refresh(@Payload() dto: RefreshDto) {
    try {
      const result = await this.commandBus.execute(
        new RefreshCommand(dto.refreshToken),
      );
      return result as LoginResponseDto;
    } catch (error: any) {
      this.logger.error('Refresh failed', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('auth-service.register')
  async register(@Payload() dto: RegisterDto) {
    try {
      await this.commandBus.execute(
        new RegisterCommand(dto.email, dto.password),
      );
      return { success: true, message: 'Registration initiated' };
    } catch (error: any) {
      this.logger.error('Registration failed', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('auth-service.confirm')
  async confirm(@Payload() dto: ConfirmDto) {
    this.logger.info(`Confirming registration for user ${dto.email}`);
    try {
      await this.commandBus.execute(
        new ConfirmRegistrationCommand(dto.email, dto.code),
      );
      return { success: true, message: 'Confirmation successful' };
    } catch (error) {
      this.logger.error('Confirmation failed', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('auth-service.reset-password')
  async resetPassword(@Payload() dto: ResetPasswordDto) {
    try {
      await this.commandBus.execute(new ResetPasswordCommand(dto.email));

      return { success: true, message: 'Reset password initiated' };
    } catch (error: any) {
      this.logger.error('Reset password failed', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('auth-service.confirm-reset-password')
  async confirmResetPassword(@Payload() dto: ConfirmDto) {
    try {
      await this.commandBus.execute(
        new ConfirmResetPasswordCommand(dto.email, dto.code),
      );
      return { success: true, message: 'Reset password confirmed' };
    } catch (error: any) {
      this.logger.error('Reset password confirmation failed', error);
      throw new RpcException(error.message as Error);
    }
  }

  @MessagePattern('auth-service.set-new-password')
  async setNewPassword(@Payload() dto: SetNewPasswordDto) {
    try {
      await this.commandBus.execute(
        new SetNewPasswordCommand(dto.email, dto.password),
      );
      return { success: true, message: 'New password set' };
    } catch (error: any) {
      this.logger.error('New password setting failed', error);
      throw new RpcException(error.message as Error);
    }
  }
}
