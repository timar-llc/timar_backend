import { IsNotEmpty } from 'class-validator';

export class SetAvatarDto {
  @IsNotEmpty()
  userUuid: string;

  @IsNotEmpty()
  avatar: string;
}
