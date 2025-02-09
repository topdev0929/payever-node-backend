import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { PaginationDto } from './pagination.dto';

export class IntegrationSubscriptionListDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  public businessData: boolean = false;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Boolean)
  public active: boolean = false;

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  public categories: string[];

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  public containName: string[];

  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  public notContainName: string[];
}
