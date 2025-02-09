import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, QueryDto, Roles, RolesEnum } from '@pe/nest-kit';
import { PluginCommandDto, PluginCommandSearchDto } from '../dto';
import { PluginCommandModel } from '../models';
import { PluginCommandService } from '../services';

@UseGuards(JwtAuthGuard)
@Controller('plugin/command')
@ApiTags('plugin-command')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class PluginCommandController {
  constructor(
    private readonly pluginCommandService: PluginCommandService,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.admin)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The command has been created.' })
  public async createCommand(
    @Body() dto: PluginCommandDto,
  ): Promise<PluginCommandModel> {
    return this.pluginCommandService.createCommand(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'The command has been deleted.' })
  public async deleteCommand(
    @ParamModel(':id', 'PluginCommand') command: PluginCommandModel,
  ): Promise<void> {
    await this.pluginCommandService.deleteCommand(command);
  }

  @Get('list')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  @ApiResponse({ status: HttpStatus.OK, description: 'The command list successfully fetched.' })
  public async getCommandListFromDate(
    @QueryDto() sarchDto: PluginCommandSearchDto,
  ): Promise<PluginCommandModel[]> {
    return this.pluginCommandService.searchCommands(sarchDto);
  }
}
