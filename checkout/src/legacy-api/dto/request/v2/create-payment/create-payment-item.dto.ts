import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiCallCartItemInterface } from '../../../../../common/interfaces';

export class CreatePaymentItemDto implements ApiCallCartItemInterface {
  @ApiProperty()
  @IsOptional({ groups: ['create', 'submit']})
  public extra_data: { };

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public name: string;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public price: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public price_netto?: number;

  @ApiProperty({ required: false})
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public vat_rate?: number;

  @ApiProperty()
  @IsNumber({ }, { groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public quantity: number;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsNotEmpty({ groups: ['create', 'submit']})
  public identifier: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public description?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public sku?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public thumbnail?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public url?: string;
}
