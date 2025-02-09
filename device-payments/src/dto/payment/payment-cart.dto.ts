import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentCartDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public identifier: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public sku: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public vat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public quantity: number;
}
