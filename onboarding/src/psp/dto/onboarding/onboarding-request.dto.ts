import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

import { AuthOnboardingDto } from './auth-onboarding.dto';
import { BusinessOnboardingDto } from './business-onboarding.dto';
import { PaymentMethodDto } from './payment-method.dto';
import { OnboardingRequestTypeEnum } from '../../enums';

export class OnboardingRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AuthOnboardingDto)
  public auth: AuthOnboardingDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BusinessOnboardingDto)
  public business: BusinessOnboardingDto;

  @ApiProperty({
    isArray: true,
    required: false,
    type: PaymentMethodDto,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  public payment_methods: PaymentMethodDto[] = [];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public platformLogin: boolean = false;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public type: string = OnboardingRequestTypeEnum.psp;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public integrations: string[];
}
