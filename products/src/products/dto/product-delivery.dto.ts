import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDeliveryDto {
  @IsString()
  public name: string;

  @IsOptional()
  @IsNumber()
  public duration?: number;

  @IsOptional()
  @IsString()
  public measure_duration?: string;
}
