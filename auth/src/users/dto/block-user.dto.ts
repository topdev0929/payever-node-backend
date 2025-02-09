import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class BlockUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public userIp: string;
}
