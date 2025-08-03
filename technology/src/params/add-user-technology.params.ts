import { IsString } from 'class-validator';

export class AddUserTechnologyParams {
  @IsString()
  name: string;

  @IsString()
  userUuid: string;
}
