import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetNewPasswordCommand } from 'src/commands/set-new-password/set-new-password.command';
import { LokiLoggerService } from '@djeka07/nestjs-loki-logger';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordHandler
  implements ICommandHandler<SetNewPasswordCommand>
{
  constructor(
    private readonly logger: LokiLoggerService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async execute(command: SetNewPasswordCommand) {
    const { email, password } = command;
    this.logger.info(`Setting new password for user ${email}`);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new RpcException('User not found');
    }
    user.passwordHash = passwordHash;
    await this.usersRepository.save(user);
    this.logger.info(`New password set for user ${email}`);
  }
}
