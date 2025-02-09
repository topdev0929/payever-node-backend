/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ChatMessageComponentTypeEnum, ChatMessageComponentParameterTypeEnum } from '@pe/message-kit';

export class ProviderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;
}
export class DocumentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public link: string;

  @ApiProperty({ required: false, type: ProviderDto })
  @ValidateNested()
  @Type(() => ProviderDto)
  @IsOptional()
  public provider?: ProviderDto;
}
export class VideoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public link: string;

  @ApiProperty({ required: false, type: ProviderDto })
  @ValidateNested()
  @Type(() => ProviderDto)
  @IsOptional()
  public provider?: ProviderDto;
}
export class ImageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public link: string;

  @ApiProperty({ required: false, type: ProviderDto })
  @ValidateNested()
  @Type(() => ProviderDto)
  @IsOptional()
  public provider?: ProviderDto;
}
export class CurrencyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public fallbackValue: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public code: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public amount1000: number;
}

export class ChatMessageComponentParameterDto {
  @ApiProperty({ enum: Object.values(ChatMessageComponentParameterTypeEnum) })
  @IsEnum(ChatMessageComponentParameterTypeEnum)
  @IsNotEmpty()
  public type: ChatMessageComponentParameterTypeEnum;

  @ApiProperty({ required: false })
  @ValidateIf(o => o.type === ChatMessageComponentParameterTypeEnum.Text)
  @IsString()
  @IsNotEmpty()
  public text?: string;

  @ApiProperty({ required: false, type: DocumentDto })
  @ValidateIf(o => o.type === ChatMessageComponentParameterTypeEnum.Document)
  @ValidateNested()
  @Type(() => DocumentDto)
  @IsNotEmpty()
  public document?: DocumentDto;

  @ApiProperty({ required: false, type: VideoDto })
  @ValidateIf(o => o.type === ChatMessageComponentParameterTypeEnum.Video)
  @ValidateNested()
  @Type(() => VideoDto)
  @IsNotEmpty()
  public video?: VideoDto;

  @ApiProperty({ required: false, type: ImageDto })
  @ValidateIf(o => o.type === ChatMessageComponentParameterTypeEnum.Image)
  @ValidateNested()
  @Type(() => ImageDto)
  @IsNotEmpty()
  public image?: ImageDto;

  @ApiProperty({ required: false, type: CurrencyDto })
  @ValidateIf(o => o.type === ChatMessageComponentParameterTypeEnum.Currency)
  @ValidateNested()
  @Type(() => CurrencyDto)
  @IsNotEmpty()
  public currency?: CurrencyDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public action?: string;
}

export class ChatMessageComponentDto {
  @ApiProperty({ enum: Object.values(ChatMessageComponentTypeEnum) })
  @IsEnum(ChatMessageComponentTypeEnum)
  @IsNotEmpty()
  public type: ChatMessageComponentTypeEnum;

  @ApiProperty({ isArray: true, type: ChatMessageComponentParameterDto })
  @ValidateNested({ each: true })
  @Type(() => ChatMessageComponentParameterDto)
  @IsNotEmpty()
  public parameters: ChatMessageComponentParameterDto[];
}
