import { IsString, IsEnum, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { PostStatusEnum } from '../enums';
import { PostStateErrorDto } from './post-state-error.dto';

export class PostStateDto {
  @IsEnum(PostStatusEnum)
  @ApiProperty({
    enum: PostStatusEnum,
  })
  public status: PostStatusEnum;

  @IsString()
  public integrationName: string;

  @IsString()
  public postId: string;

  @IsString()
  public postedAt: Date;

  @ApiProperty()
  @Type(() => PostStateErrorDto)
  @ValidateNested()
  @ValidateIf(
    (self: PostStateDto) =>
        self.status === PostStatusEnum.Failed,
  )
  public error?: PostStateErrorDto;
}
