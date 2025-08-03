import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { EditBasicInfoCommand } from 'src/commands/edit-basic-info.command';
import { Repository } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(EditBasicInfoCommand)
export class EditBasicInfoHandler
  implements ICommandHandler<EditBasicInfoCommand>
{
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: EditBasicInfoCommand): Promise<void> {
    const { dto } = command;
    console.log(dto);
    const profile = await this.profileRepository.findOne({
      where: { userUuid: dto.userUuid },
    });
    if (!profile) {
      throw new RpcException('Profile not found');
    }

    // Фильтруем только заполненные поля
    const filledFields = Object.keys(dto).filter(
      (key) =>
        key !== 'userUuid' &&
        dto[key] !== undefined &&
        dto[key] !== null &&
        dto[key] !== '',
    );
    const profileCompleteness = (filledFields.length / 5) * 100; // 5 полей без userUuid

    await this.profileRepository.update(profile.uuid, {
      ...dto,
      profileCompleteness,
    });
  }
}
