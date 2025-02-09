import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DisplayModesEnum, SortModesEnum, WidgetTypesEnum } from '../enums';
import { AmountDto } from './amount.dto';
import { PaymentOptionDto } from './payment-option.dto';

export class UpdateWidgetDto {
  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => AmountDto)
  public amountLimits: AmountDto;

  @ApiProperty()
  @IsString()
  public checkoutId: string;

  @ApiProperty()
  @IsString()
  public checkoutMode: string;

  @ApiProperty()
  @IsEnum(DisplayModesEnum)
  public checkoutPlacement: DisplayModesEnum;

  @ApiProperty()
  @IsBoolean()
  public isVisible: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public maxHeight?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public minHeight?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public theme?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public alignment?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public maxWidth?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public minWidth?: number;

  @ApiProperty( { type: PaymentOptionDto})
  @IsArray()
  @ValidateNested()
  @Type(() => PaymentOptionDto)
  public payments: PaymentOptionDto[];

  @ApiProperty()
  @IsEnum(SortModesEnum)
  public ratesOrder: SortModesEnum;

  @ApiProperty()
  @IsDefined()
  public styles: any;

  @ApiProperty()
  @IsEnum(WidgetTypesEnum)
  public type: WidgetTypesEnum;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public cancelUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public failureUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public noticeUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public pendingUrl?: string;

  @ApiProperty({ required: false})
  @IsString()
  @IsOptional()
  public successUrl?: string;
}
