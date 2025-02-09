import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public userId: string;
}
