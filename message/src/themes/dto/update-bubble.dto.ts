import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsHexColor,
  IsOptional,
  IsString,
} from 'class-validator';

import { BubbleBrandEnum, BubbleStyleEnum, BubbleLayoutEnum } from '../enums';

export class UpdateBubbleDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public showBubble?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public showNotifications?: boolean;

  @ApiProperty({
    enum: BubbleBrandEnum,
    required: false,
  })
  @IsEnum(BubbleBrandEnum)
  @IsOptional()
  public brand: BubbleBrandEnum;

  @ApiProperty({
    enum: BubbleStyleEnum,
    required: false,
  })
  @IsEnum(BubbleStyleEnum)
  @IsOptional()
  public style: BubbleStyleEnum;

  @ApiProperty({
    enum: BubbleLayoutEnum,
    required: false,
  })
  @IsEnum(BubbleLayoutEnum)
  @IsOptional()
  public layout: BubbleLayoutEnum;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public logo: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public text: string;

  @ApiProperty({ required: false })
  @IsHexColor()
  @IsOptional()
  public bgColor: string;

  @ApiProperty({ required: false })
  @IsHexColor()
  @IsOptional()
  public textColor: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public boxShadow: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public roundedValue: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public blurBox: string;
}
