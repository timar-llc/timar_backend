import { IsString } from 'class-validator';

export class ToggleUserTechnologyParams {
  @IsString()
  technologyUuid: string;

  @IsString()
  userUuid: string;
}
