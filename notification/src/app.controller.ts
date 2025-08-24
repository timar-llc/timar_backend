import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MailerService } from './mailer/mailer.service';
import { ConfirmDto } from './dto/confirm-code.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
    private readonly logger: LokiLoggerService,
  ) {}

  @MessagePattern('notification.registration.send_registration_code')
  async sendRegistrationCode(@Payload() dto: ConfirmDto) {
    this.logger.info(
      `Sending registration code to email: ${dto.email} or phone number: ${dto.phoneNumber}`,
    );
    if (dto.phoneNumber) {
      this.mailerService.sendRegistrationSms(dto.phoneNumber, dto.code);
    } else {
      await this.mailerService.sendRegistrationEmail(dto.email, dto.code);
    }
    return { success: true, message: 'Registration code sent' };
  }

  @MessagePattern('notification.reset-password.send_reset_password_code')
  async sendResetPasswordCode(@Payload() dto: ConfirmDto) {
    this.logger.info(
      `Sending reset password code to email: ${dto.email} or phone number: ${dto.phoneNumber}`,
    );
    if (dto.phoneNumber) {
      this.mailerService.sendResetPasswordSms(dto.phoneNumber, dto.code);
    } else {
      await this.mailerService.sendResetPasswordEmail(dto.email, dto.code);
    }
    return { success: true, message: 'Reset password code sent' };
  }
  @MessagePattern('notification.login.send_login_code')
  sendLoginCode(@Payload() dto: LoginDto) {
    this.logger.info(`Sending login code to phone number: ${dto.phoneNumber}`);
    this.mailerService.sendLoginSms(dto.phoneNumber, dto.code);
    return { success: true, message: 'Login code sent' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
