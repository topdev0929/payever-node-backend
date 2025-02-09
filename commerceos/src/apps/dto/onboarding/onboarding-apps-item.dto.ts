import { IsNotEmpty, IsUUID, IsBoolean, IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { SetupStatusEnum } from '../../enums/setup-status.dto';

export class OnboardingAppsItemDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  public app: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public installed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SetupStatusEnum)
  public setupStatus?: SetupStatusEnum;
}
