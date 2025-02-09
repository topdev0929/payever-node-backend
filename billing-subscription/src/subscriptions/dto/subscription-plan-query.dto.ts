import { ApiProperty } from '@nestjs/swagger';
import { Type  } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';
import { BaseQueryDto } from './base-query.dto';


export class SubscriptionPlanQueryDto extends BaseQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  public businessIds?: string[];
}
