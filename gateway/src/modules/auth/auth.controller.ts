import { Body, Controller, Inject, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ClientProxy } from '@nestjs/microservices';
import { ConfirmDto } from './dto/confirm-code.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientProxy,
    @InjectPinoLogger('GATEWAY.AuthController')
    private readonly logger: PinoLogger,
  ) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    this.logger.info('Sending register command via RabbitMQ...');
    this.client.emit('auth-service.register', body).subscribe({
      next: () => {
        this.logger.info('Register command sent');
      },
      error: (error) => {
        this.logger.error('Error sending register command', error);
      },
    });
    return { message: 'Register command sent' };
  }

  @Post('confirm-registration')
  confirm(@Body() body: ConfirmDto) {
    this.client.emit('auth-service.confirm', body).subscribe({
      next: () => {
        this.logger.info('Confirm command sent');
      },
      error: (error) => {
        this.logger.error('Error sending confirm command', error);
      },
    });
    return { message: 'Confirm command sent' };
  }
}
