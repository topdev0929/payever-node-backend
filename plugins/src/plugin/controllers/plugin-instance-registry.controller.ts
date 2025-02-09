import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { PluginInstanceRegistryCreateDto } from '../dto';
import { PluginInstanceRegistryDto } from '../dto/plugin-instance-registry.dto';
import { PluginCommandModel, PluginInstanceRegistryModel } from '../models';
import { PluginCommandSchemaName } from '../schemas';
import { PluginInstanceRegistryService } from '../services';

@Controller('plugin/registry')
@ApiTags('plugin-registry')
@Roles(RolesEnum.anonymous)
export class PluginInstanceRegistryController {
  constructor(
    private readonly pluginInstanceRegistryService: PluginInstanceRegistryService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiResponse({ status: HttpStatus.OK, description: 'The plugin instance has been successfully registered.' })
  public async register(
    @Body() dto: PluginInstanceRegistryCreateDto,
  ): Promise<PluginInstanceRegistryModel> {
    return this.pluginInstanceRegistryService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('unregister')
  @ApiResponse({ status: HttpStatus.OK, description: 'The plugin instance has been successfully unregistered.' })
  public async unregister(
    @Body() dto: PluginInstanceRegistryDto,
  ): Promise<PluginInstanceRegistryModel> {
    return this.pluginInstanceRegistryService.unregister(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('ack/:commandId')
  @ApiResponse({ status: HttpStatus.OK, description: 'The plugin command has been successfully acknowledged.' })
  public async acknowledgeCommand(
    @ParamModel(':commandId', PluginCommandSchemaName) command: PluginCommandModel,
    @Body() dto: PluginInstanceRegistryDto,
  ): Promise<PluginInstanceRegistryModel> {
    return this.pluginInstanceRegistryService.acknowledgeCommand(dto, command);
  }
}
