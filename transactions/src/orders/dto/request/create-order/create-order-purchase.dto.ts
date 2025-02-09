import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderPurchaseDto {
  @ApiProperty()
  @IsNumber({ }, { groups: ['create']})
  @Max(99999999.99, { groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  @Type(() => Number)
  public amount: number;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsNotEmpty({ groups: ['create']})
  public currency: string;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create']})
  @IsOptional({ groups: ['create']})
  public delivery_fee?: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create']})
  @IsOptional({ groups: ['create']})
  public down_payment?: number;
}
