import { BaseQueryDto } from '../../common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';

export class ProductQueryDto extends BaseQueryDto{
  @ApiProperty({ required: false })
  @IsOptional()
  public businessIds?: string[];
}
