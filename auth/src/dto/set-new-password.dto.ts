import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SetNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;
}
