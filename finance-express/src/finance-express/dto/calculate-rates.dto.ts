import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumberString, IsString, IsOptional } from 'class-validator';
import { PaymentOptionsEnum, WidgetTypesEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { CalculateRatesInterface } from '../interfaces';

export class CalculateRatesDto implements CalculateRatesInterface{
  @IsNumberString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty()
  public amount: number;

  @IsEnum(PaymentOptionsEnum)
  @Expose()
  @ApiProperty()
  public paymentOption: PaymentOptionsEnum;

  @Expose()
  @ApiProperty()
  public widgetId: string;

  @IsOptional()
  @IsEnum(WidgetTypesEnum)
  @Expose()
  @ApiProperty()
  public widgetType?: WidgetTypesEnum;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty()
  public connectionId?: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty()
  public code?: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty()
  public reference?: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty()
  public widgetPlaced?: string;

  @IsNumberString()
  @IsOptional()
  @Expose()
  @ApiProperty()
  public downPayment?: number;

  [ key: string ]: any;
}
