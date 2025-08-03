import { IsOptional, IsString } from 'class-validator';

export class EditBasicInfoDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  countryUuid: string;

  @IsString()
  @IsOptional()
  specialization: string;

  @IsString()
  @IsOptional()
  cv: string;
}
