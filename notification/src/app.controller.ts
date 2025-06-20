import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MailerService } from './mailer/mailer.service';
import { ConfirmDto } from './dto/confirm-code.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
    @InjectPinoLogger('NotificationService')
    private readonly logger: PinoLogger,
  ) {}

  @EventPattern('notification.registration.send_registration_code')
  async sendRegistrationCode(@Payload() dto: ConfirmDto) {
    this.logger.info(`Sending registration email to ${dto.email}`);
    await this.mailerService.sendRegistrationEmail(dto.email, dto.code);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
