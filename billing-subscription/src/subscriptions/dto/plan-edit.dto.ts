import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PlanTypeEnum } from '../enums';

export class PlanEditDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  @IsString()
  public businessId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PlanTypeEnum)
  public type: PlanTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  @IsString()
  public product: string;
}
