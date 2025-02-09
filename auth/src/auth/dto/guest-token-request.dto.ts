import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GuestTokenRequestDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public ipHash?: string;
}
