import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ProductShippingDto {
  @IsOptional()
  @IsBoolean()
  public free?: boolean;

  @IsOptional()
  @IsBoolean()
  public general?: boolean;

  @IsNumber()
  public weight: number;

  @IsNumber()
  public width: number;

  @IsNumber()
  public length: number;

  @IsNumber()
  public height: number;
}
