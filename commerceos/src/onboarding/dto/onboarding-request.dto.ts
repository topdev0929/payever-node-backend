import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsEnum } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import {
  OnboardingPaymentCountryEnum,
  OnboardingPaymentDeviceEnum,
  OnboardingPaymentMethodEnum,
  OnboardingPaymentNameEnum,
} from '../enums';

@Exclude()
export class OnboardingRequestDto {
  @ApiProperty({ required: true })
  @IsDefined()
  @Expose()
  public name: OnboardingPaymentNameEnum | string;

  @ApiProperty({ required: false, enum: OnboardingPaymentCountryEnum })
  @IsOptional()
  @IsEnum(OnboardingPaymentCountryEnum)
  @Expose()
  public country?: OnboardingPaymentCountryEnum;

  @ApiProperty({ required: false, enum: OnboardingPaymentMethodEnum  })
  @IsOptional()
  @IsEnum(OnboardingPaymentMethodEnum)
  @Expose()
  public method?: OnboardingPaymentMethodEnum;

  @ApiProperty({ required: false, enum: OnboardingPaymentDeviceEnum  })
  @IsOptional()
  @IsEnum(OnboardingPaymentDeviceEnum)
  @Expose()
  public device?: OnboardingPaymentDeviceEnum;

}
