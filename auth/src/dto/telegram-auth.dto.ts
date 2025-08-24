import { IsNotEmpty, IsOptional } from 'class-validator';

export class TelegramAuthDto {
  @IsNotEmpty()
  auth_date: number;
  @IsNotEmpty()
  first_name: string;
  @IsNotEmpty()
  hash: string;
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  username: string;
  @IsOptional()
  photo_url?: string;
}
