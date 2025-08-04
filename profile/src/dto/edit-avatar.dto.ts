import { IsNotEmpty, IsString } from 'class-validator';

export class EditAvatarDto {
  @IsNotEmpty()
  @IsString()
  userUuid: string;

  @IsNotEmpty()
  avatar: string | File;
}
