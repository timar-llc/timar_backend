import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditAvatarCommand } from '../commands/edit-avatar.command';
import { StorageService } from '../config/s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';

@CommandHandler(EditAvatarCommand)
export class EditAvatarHandler implements ICommandHandler<EditAvatarCommand> {
  constructor(
    private readonly storageService: StorageService,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async execute(command: EditAvatarCommand): Promise<void> {
    console.log('EditAvatarHandler received command:', command);
    const { userUuid, avatar } = command.dto;
    console.log('userUuid:', userUuid);
    console.log('avatar:', avatar);

    const avatarUrl = await this.storageService.uploadFile(avatar);
    console.log('avatarUrl:', avatarUrl);

    const profile = await this.profileRepository.findOne({
      where: { userUuid },
    });
    if (!profile) {
      throw new Error('Profile not found');
    }
    profile.avatarUrl = avatarUrl;
    await this.profileRepository.save(profile);
    console.log('Profile updated successfully');
  }
}
