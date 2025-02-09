import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ConnectionDtoBase } from './connection.dto';

export class ConnectionRmqMessageDto extends ConnectionDtoBase {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public id: string;
}
