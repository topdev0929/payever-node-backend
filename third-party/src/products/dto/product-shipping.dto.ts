import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class ProductShippingDto {
  @IsOptional()
  @IsBoolean()
  public free?: boolean;

  @IsOptional()
  @IsBoolean()
  public general?: boolean;

  @IsNumber()
  @IsNotEmpty()
  public weight: number;

  @IsNumber()
  @IsNotEmpty()
  public width: number;

  @IsNumber()
  @IsNotEmpty()
  public length: number;

  @IsNumber()
  @IsNotEmpty()
  public height: number;
}
