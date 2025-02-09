import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentPurchaseDto {
  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @Max(99999999.99, { groups: ['create', 'submit', 'link']})
  @Min(0, { groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link', 'has_order']})
  @Type(() => Number)
  public amount: number;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['link', 'has_order']})
  public currency: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public country?: string;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @Min(0, { groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public delivery_fee?: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit', 'link']})
  @Min(0, { groups: ['create', 'submit', 'link']})
  @IsOptional({ groups: ['create', 'submit', 'link']})
  public down_payment?: number;
}
