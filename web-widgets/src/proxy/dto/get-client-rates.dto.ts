import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsString, IsOptional } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';
import { GetClientActionDto } from './get-client-action.dto';

@Exclude()
export class GetClientRatesDto extends GetClientActionDto {
  @IsNumberString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  public amount: string;

  @Expose()
  @IsString()
  @ApiProperty()
  public paymentOption: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty({ required: false})
  public code?: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty({ required: false})
  public reference?: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty({ required: false})
  public widgetPlaced?: string;

  @IsNumberString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  public downPayment?: string;

  [key: string]: any;
}
