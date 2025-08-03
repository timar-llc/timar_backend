import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AddUserTechnologyCommand } from '../commands/add-user-technology.command';

import { Repository } from 'typeorm';
import { UserTechnology } from '../entities/userTechnology.entity';
import { GetTechnologyQuery } from 'src/queries/get-technology.query';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(AddUserTechnologyCommand)
export class AddUserTechnologyHandler
  implements ICommandHandler<AddUserTechnologyCommand>
{
  constructor(
    @InjectRepository(UserTechnology)
    private readonly userTechnologyRepository: Repository<UserTechnology>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: AddUserTechnologyCommand) {
    const { params } = command;
    const technology = await this.queryBus.execute(
      new GetTechnologyQuery({ name: params.name }),
    );

    const existingUserTechnology = await this.userTechnologyRepository.findOne({
      where: {
        technologyUuid: technology.uuid,
        userUuid: params.userUuid,
      },
    });
    if (existingUserTechnology) {
      throw new RpcException('Technology already exists');
    }
    const userTechnology = this.userTechnologyRepository.create({
      technologyUuid: technology.uuid,
      userUuid: params.userUuid,
    });

    await this.userTechnologyRepository.save(userTechnology);
  }
}
