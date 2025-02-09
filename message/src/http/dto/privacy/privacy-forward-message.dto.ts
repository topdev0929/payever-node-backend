import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { StatusEnum } from '../../../message';

export class PrivacyForwardedMessagesDto {
  @ApiProperty({ enum: StatusEnum, required: false })
  @IsEnum(StatusEnum)
  @IsOptional()
  public showTo: StatusEnum;
}
