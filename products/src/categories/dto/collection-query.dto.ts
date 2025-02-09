import { BaseQueryDto } from '../../common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';

export class CollectionQueryDto extends BaseQueryDto{
  @ApiProperty({ required: false })
  @IsOptional()
  public businessIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public parent?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  public ancestors?: string;  

  @ApiProperty({ required: false })
  @IsOptional()
  public channelSets?: string;
}
