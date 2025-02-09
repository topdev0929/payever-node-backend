import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsOptional,
} from 'class-validator';
import {
  Type,
  Transform,
} from 'class-transformer';

export class DisableNotificationDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public forever: boolean;

  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @Transform((value: string) => new Date(value))
  @IsOptional()
  public until: Date;
}
