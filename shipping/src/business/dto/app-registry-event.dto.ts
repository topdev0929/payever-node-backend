import { IsNotEmpty, IsString } from 'class-validator';

export class AppRegistryEventDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  @IsString()
  public code: string;
}
