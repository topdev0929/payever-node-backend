import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class OuterStockChangedDto {
  @ApiProperty()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  public quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  public stock?: number;
}
