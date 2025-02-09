import { IsString, IsOptional, IsEnum, IsDateString, IsArray, IsNotEmpty } from 'class-validator';
import { PoststatusEnum, PostTypeEnum } from '../enums';
import { ApiProperty } from '@nestjs/swagger';
import { MediaDto } from './media.dto';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  public title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  public content: string;

  @IsOptional()
  @ApiProperty()
  public media?: string[];

  @IsOptional()
  @ApiProperty()
  public attachments?: MediaDto[];

  @IsArray()
  @ApiProperty()
  public channelSet: string[];

  @IsEnum(PoststatusEnum)
  @ApiProperty()
  public status: PoststatusEnum;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  public toBePostedAt?: Date;

  @IsDateString()
  @IsOptional()
  @ApiProperty()
  public postedAt?: Date;

  @IsEnum(PostTypeEnum)
  @ApiProperty()
  public type: PostTypeEnum;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  public productId: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  public parentFolderId: string;
}
