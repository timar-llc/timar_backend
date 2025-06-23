import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class ConfirmDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  code: string;
}

export enum ConfirmCodeTypeEnum {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset-password',
}

export class ConfirmCodeType {
  @IsEnum(ConfirmCodeTypeEnum)
  @ApiProperty({
    enum: ConfirmCodeTypeEnum,
    description: 'The type of code to confirm',
  })
  type: ConfirmCodeTypeEnum;
}
