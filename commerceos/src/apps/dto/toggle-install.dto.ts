import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SetupStatusEnum } from '../enums/setup-status.dto';

export class ToggleDisallowedDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public code?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SetupStatusEnum)
  public setupStatus?: SetupStatusEnum;
}
