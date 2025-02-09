import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class OwnershipTransferDto {
  @ApiProperty()
  @IsString()
  @Transform((email: string) => email?.toLowerCase())
  public email: string;
}
