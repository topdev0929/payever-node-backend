import { IsDefined, IsEnum, ValidateNested, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentOptionsEnum } from '../enums';
import { AmountDto } from './amount.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CustomWidgetSettingDto } from './custom-widget-settings.dto';

export class PaymentOptionDto {
  @ApiProperty()
  @IsEnum(PaymentOptionsEnum)
  public paymentMethod: PaymentOptionsEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public connectionId: string;

  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => AmountDto)
  public amountLimits: AmountDto;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  public enabled: boolean;

  @ApiProperty()
  @IsBoolean()
  public isBNPL: boolean;

  @ApiProperty({ required: false})
  @IsOptional()
  public productId?: string;

  @ApiProperty({ required: false})
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomWidgetSettingDto)
  public customWidgetSetting?: CustomWidgetSettingDto;

}
