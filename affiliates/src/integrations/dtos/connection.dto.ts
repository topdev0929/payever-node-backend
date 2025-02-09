import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ConnectionDtoBase {
  @ApiProperty()
  @IsBoolean()
  public isEnabled: boolean;
}
