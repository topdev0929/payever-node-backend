import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfigureInboundSMSDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public phone: string;
}
