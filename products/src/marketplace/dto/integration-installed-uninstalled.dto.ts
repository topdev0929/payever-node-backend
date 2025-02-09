import { IsNotEmpty, IsString } from 'class-validator';

export class IntegrationInstalledUninstalled {
  @IsNotEmpty()
  @IsString()
  public name: string;

  @IsNotEmpty()
  @IsString()
  public category: string;

  @IsNotEmpty()
  @IsString()
  public businessId: string;
}
