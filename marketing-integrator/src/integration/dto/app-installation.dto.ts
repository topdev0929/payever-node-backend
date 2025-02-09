import { IsString } from 'class-validator';

export class AppInstallationDto {
  @IsString()
  public businessId: string;

  @IsString()
  public code: string;
}
