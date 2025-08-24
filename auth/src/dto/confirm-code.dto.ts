import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ConfirmDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  code: string;
}
