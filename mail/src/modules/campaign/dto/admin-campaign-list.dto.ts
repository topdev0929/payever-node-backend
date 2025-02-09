import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ListDto } from './list.dto';

export class AdminCampaignListDto extends ListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((value: string) => value.split(','))
  public businessIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((value: string) => value.split(','))
  public channelSetIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  @Transform((value: string) => value.split(','))
  public builderMailIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  public populate?: boolean;
}
