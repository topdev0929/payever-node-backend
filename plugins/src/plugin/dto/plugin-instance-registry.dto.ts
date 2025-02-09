import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PluginInstanceRegistryDto {
  @ApiProperty()
  @IsString()
  public channel: string;

  @ApiProperty()
  @IsString()
  public host: string;
}
