import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UnblockUsersDto {
  @ApiProperty()
  @IsString()
  public userId: string;

  @ApiProperty()
  @IsString()
  public userIp: string;
}
