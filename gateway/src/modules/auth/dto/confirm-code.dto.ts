import { IsEmail, IsNotEmpty } from 'class-validator';

export class ConfirmDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;
}
