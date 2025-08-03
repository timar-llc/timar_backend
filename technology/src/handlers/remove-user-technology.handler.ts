import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveUserTechnologyCommand } from '../commands/remove-user-technology.command';

import { Repository } from 'typeorm';
import { UserTechnology } from '../entities/userTechnology.entity';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(RemoveUserTechnologyCommand)
export class RemoveUserTechnologyHandler
  implements ICommandHandler<RemoveUserTechnologyCommand>
{
  constructor(
    @InjectRepository(UserTechnology)
    private readonly userTechnologyRepository: Repository<UserTechnology>,
  ) {}

  async execute(command: RemoveUserTechnologyCommand) {
    const { params } = command;
    const userTechnology = await this.userTechnologyRepository.findOne({
      where: {
        technologyUuid: params.technologyUuid,
        userUuid: params.userUuid,
      },
    });
    if (!userTechnology) throw new RpcException('User technology not found');
    await this.userTechnologyRepository.delete(userTechnology.uuid);
  }
}
