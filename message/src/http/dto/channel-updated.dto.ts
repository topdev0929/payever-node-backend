import { ApiProperty } from '@nestjs/swagger';
import { CommonChannelInterface } from '@pe/message-kit';
import { IsString, IsOptional, IsBoolean, IsEnum, Matches } from 'class-validator';
import { ChannelTypeEnum } from '../../message';

export class ChannelUpdateHttpRequestDto implements Partial<CommonChannelInterface> {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public photo?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public signed?: boolean;

  @ApiProperty()
  @IsString()
  @Matches(/[a-z0-9-_]+/i)
  @IsOptional()
  public slug?: string;

  @ApiProperty({ required: false })
  @IsEnum(ChannelTypeEnum)
  @IsOptional()
  public subType: ChannelTypeEnum;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsOptional()
  public usedInWidget?: boolean;
}
