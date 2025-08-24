import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetAvatarCommand } from '../commands/set-avatar.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';

@CommandHandler(SetAvatarCommand)
export class SetAvatarHandler implements ICommandHandler<SetAvatarCommand> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: SetAvatarCommand) {
    const { userUuid, avatar } = command.dto;
    const profile = await this.profileRepository.findOne({
      where: { userUuid },
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.avatarUrl = avatar;
    await this.profileRepository.save(profile);
    return { success: true, message: 'Avatar set' };
  }
}
