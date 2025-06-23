import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProfileCommand } from 'src/commands/create-profile.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand>
{
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async execute(command: CreateProfileCommand) {
    const { userUuid } = command;
    const profile = this.profileRepository.create({ userUuid });
    await this.profileRepository.save(profile);
    return { success: true, message: 'Profile created' };
  }
}
