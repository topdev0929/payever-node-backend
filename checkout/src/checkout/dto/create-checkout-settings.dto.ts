import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested, Equals, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

import { CheckoutCallbacksDto } from './checkout-callbacks.dto';
import { CheckoutLanguageInterface, StylesSettingsInterface } from '../interfaces';
import { CheckoutBusinessTypeEnum } from '../../common/enum';

export class CreateCheckoutSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public businessType?: CheckoutBusinessTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @ValidateNested({ groups: ['create', 'update'] })
  @Type(() => CheckoutCallbacksDto)
  public callbacks?: CheckoutCallbacksDto;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public testingMode?: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public customerAccount?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  public policies?: any;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public styles?: StylesSettingsInterface;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public languages?: CheckoutLanguageInterface[];

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public message?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public keyword?: string;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public cspAllowedHosts?: string[];

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public enableCustomerAccount: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['customerAccountEnabled'] })
  public enablePayeverTerms: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public enableLegalPolicy: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public enableDisclaimerPolicy: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public enableRefundPolicy: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public enableShippingPolicy: boolean;

  @ApiProperty({ required: false })
  @IsOptional({ groups: ['create', 'update'] })
  public enablePrivacyPolicy: boolean;

}

