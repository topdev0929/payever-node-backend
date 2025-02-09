import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PluginCommandNameEnum } from '../enums';
import { PluginInstanceRegistryDto } from './plugin-instance-registry.dto';

export class PluginInstanceRegistryCreateDto extends PluginInstanceRegistryDto {
  @ApiProperty()
  @IsString()
  public cmsVersion: string;

  @ApiProperty()
  @IsString()
  public pluginVersion: string;

  @ApiProperty({ enum: PluginCommandNameEnum })
  public supportedCommands: PluginCommandNameEnum[];

  @ApiProperty({ required: false })
  public commandEndpoint?: string;

  @ApiProperty({ required: false })
  public businessIds: string[];
}
