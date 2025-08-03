import { IsString } from 'class-validator';

export class RemoveTechnologyDto {
  @IsString()
  technologyUuid: string;
}
