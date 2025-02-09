import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SetupStatusEnum } from '../enums/setup-status.dto';

export class ToggleInstallDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  public installed: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public disallowed?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public code?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public microUuid?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SetupStatusEnum)
  public setupStatus?: SetupStatusEnum;
}
