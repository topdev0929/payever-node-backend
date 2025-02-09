import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentActionItemDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty()
  @IsString()
  public identifier: string;

  @ApiProperty()
  @IsNumber()
  public price: number;

  @ApiProperty()
  @IsNumber()
  public quantity: number;
}
