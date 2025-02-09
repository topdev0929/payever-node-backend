import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDataDto {
  @ApiProperty()
  @IsOptional()
  @IsDateString()
  public expiresAt: string;

  @ApiProperty()
  @IsNotEmpty()
  public data: any;
}
