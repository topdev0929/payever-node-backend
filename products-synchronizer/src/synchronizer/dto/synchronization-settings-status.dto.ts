import { IsBoolean, IsOptional } from 'class-validator';

export class SynchronizationSettingsStatusDto {
  @IsBoolean()
  @IsOptional()
  public isInwardEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  public isOutwardEnabled?: boolean;
  
  @IsBoolean()
  @IsOptional()
  public isInventorySyncEnabled?: boolean;
}
