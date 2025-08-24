import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmDto {
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  code: string;
}
