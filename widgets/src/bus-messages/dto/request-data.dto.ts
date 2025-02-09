import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDataDto {
  @ApiProperty()
  @IsString({ each: true })
  public businessIds: string[];
}
