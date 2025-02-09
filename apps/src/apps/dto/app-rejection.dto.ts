import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

import { AppStatusEnum } from '../enums';

export class AppStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(AppStatusEnum)
  public status: AppStatusEnum;

  @ApiProperty({ required: false })
  @ValidateIf((o: AppStatusDto) => o.status === AppStatusEnum.Rejected)
  @IsNotEmpty()
  @IsString()
  public rejectionReason: string;
}
