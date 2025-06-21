import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ConfirmDto } from './dto/confirm-code.dto';
import { firstValueFrom } from 'rxjs';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto, LoginResponseDto, RefreshDto } from './dto/login.dto';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { CommandResponseDto } from 'src/dto/command-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    private readonly logger: LokiLoggerService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.login', body),
      );
      this.logger.log('Login successful');
      return result as LoginResponseDto;
    } catch (error) {
      this.logger.error('Login failed', error);
      throw new BadRequestException(error);
    }
  }

  @Post('refresh')
  async refresh(@Body() body: RefreshDto): Promise<LoginResponseDto> {
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.refresh', body),
      );
      this.logger.log('Refresh successful');
      return result as LoginResponseDto;
    } catch (error) {
      this.logger.error('Refresh failed', error);
      throw new BadRequestException(error);
    }
  }
  @Post('register')
  async register(@Body() body: RegisterDto): Promise<CommandResponseDto> {
    this.logger.log('Sending register command via RabbitMQ...');
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.register', body),
      );
      this.logger.log('Registration successful');
      return { message: 'Registration successful', result };
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw new BadRequestException(error);
    }
  }

  @Post('confirm-registration')
  async confirm(@Body() body: ConfirmDto): Promise<CommandResponseDto> {
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.confirm', body),
      );
      this.logger.log('Confirmation successful');
      return { message: 'Confirmation successful', result };
    } catch (error) {
      this.logger.error('Confirmation failed', error);
      throw new BadRequestException(error);
    }
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPasswordDto,
  ): Promise<CommandResponseDto> {
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.reset-password', body),
      );
      this.logger.log('Reset password successful');
      return { message: 'Reset password successful', result };
    } catch (error) {
      this.logger.error('Reset password failed', error);
      throw new BadRequestException(error);
    }
  }

  @Post('confirm-reset-password')
  async confirmResetPassword(
    @Body() body: ConfirmDto,
  ): Promise<CommandResponseDto> {
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.confirm-reset-password', body),
      );
      this.logger.log('Reset password confirmation successful');
      return { message: 'Reset password confirmation successful', result };
    } catch (error) {
      this.logger.error('Reset password confirmation failed', error);
      throw new BadRequestException(error);
    }
  }

  @Post('set-new-password')
  async setNewPassword(
    @Body() body: SetNewPasswordDto,
  ): Promise<CommandResponseDto> {
    try {
      const result = await firstValueFrom(
        this.client.send('auth-service.set-new-password', body),
      );
      this.logger.log('New password set successful');
      return { message: 'New password set successful', result };
    } catch (error) {
      this.logger.error('New password setting failed', error);
      throw new BadRequestException(error);
    }
  }
}
