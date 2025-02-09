import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { OnboardingAppsItemDto } from './onboarding-apps-item.dto';

export class OnboardingAppsDto {
  @ApiProperty({
    isArray: true,
    type: OnboardingAppsItemDto,
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type((): any => OnboardingAppsItemDto)
  public apps: OnboardingAppsItemDto[];
}
