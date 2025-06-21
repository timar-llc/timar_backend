import { IsEmail, IsNotEmpty } from 'class-validator';

export class SetNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
