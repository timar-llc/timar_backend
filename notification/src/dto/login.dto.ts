import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  code: string;
}
