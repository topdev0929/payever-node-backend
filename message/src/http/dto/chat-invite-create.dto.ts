import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsOptional,
} from 'class-validator';
import {
  Type,
  Transform,
} from 'class-transformer';

export class ChatInviteCreateHttpRequestDto {
  @ApiProperty({ required: false })
  @IsDate()
  @Type(() => Date)
  @Transform((value: string) => new Date(value))
  @IsOptional()
  public expiresAt?: Date;
}
