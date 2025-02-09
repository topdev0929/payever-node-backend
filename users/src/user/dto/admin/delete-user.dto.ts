import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class AminDeleteUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  public deleteOwnBusinesses: boolean;
}
