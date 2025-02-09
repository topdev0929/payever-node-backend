import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { OnboardingAppsDto } from './onboarding-apps.dto';

export class RpcOnboardingAppsDto extends OnboardingAppsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public userId: string;
}
