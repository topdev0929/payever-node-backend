import { IsOptional, IsBoolean, IsNumber, IsString, IsDefined } from 'class-validator';

export class ShippingDimensionsDto {
  @IsOptional()
  @IsBoolean()
  public free?: boolean;

  @IsOptional()
  @IsBoolean()
  public general?: boolean;

  @IsNumber()
  @IsDefined()
  public weight: number;

  @IsNumber()
  @IsDefined()
  public width: number;

  @IsNumber()
  @IsDefined()
  public length: number;

  @IsNumber()
  @IsDefined()
  public height: number;

  @IsString()
  @IsOptional()
  public measure_mass?: string;

  @IsString()
  @IsOptional()
  public measure_size?: string;
}
