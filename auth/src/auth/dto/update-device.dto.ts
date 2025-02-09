import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
export class UpdateDeviceDto {
  @ApiProperty()
  @IsBoolean()
  public isTrusted: boolean;
}
