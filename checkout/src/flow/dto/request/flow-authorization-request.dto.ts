import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class FlowAuthorizationRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  public token: string;
}
