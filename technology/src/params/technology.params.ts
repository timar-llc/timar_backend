import { IsOptional, IsString } from 'class-validator';

export class TechnologyParams {
  @IsString()
  @IsOptional()
  search?: string;
}

export class GetOrCreateTechnologyParams {
  @IsString()
  name: string;
}
