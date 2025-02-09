import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { SetupStatusEnum } from '../enums/setup-status.dto';

export class ToggleInstallAppDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public microUuid: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public installed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public code: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SetupStatusEnum)
  public setupStatus: SetupStatusEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public statusChangedAt: Date;
}
