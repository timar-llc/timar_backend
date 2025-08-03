import { IsString } from 'class-validator';

export class AddTechnologyDto {
  @IsString()
  name: string;
}
