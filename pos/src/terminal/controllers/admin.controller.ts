import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { BusinessSchemaName, BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ParamModel, JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { AdminTerminalListDto, CreateTerminalDto, UpdateAccessConfigDto, UpdateTerminalDto } from '../dto';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { TerminalAccessConfigService, TerminalService } from '../services';
import { TerminalRabbitEventsProducer, EventApplicationProducer } from '../producers';
import { environment } from '../../environments';
import { ChannelEventMessagesProducer } from '@pe/channels-sdk';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
export class AdminController {
  constructor(
    private readonly businessService: BusinessService<BusinessModel>,
    private readonly terminalService: TerminalService,
    private readonly terminalEventsProducer: TerminalRabbitEventsProducer,
    private readonly eventApplicationProducer: EventApplicationProducer,
    private readonly channelEventsProducer: ChannelEventMessagesProducer,
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
  ) { }

  @Get('terminals')
  public async findAll(
    @Query() dto: AdminTerminalListDto,
  ): Promise<any> {
    return this.terminalService.retrieveListForAdmin(dto);
  }

  @Post('business/:businessId/terminals')
  public async create(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() createTerminalDto: CreateTerminalDto,
  ): Promise<TerminalModel> {
    createTerminalDto.name = createTerminalDto.name || business.name;
    if (!(await this.terminalService.isNameAvailable(business, createTerminalDto.name))) {
      throw new HttpException('Terminal name not available', HttpStatus.CONFLICT);
    }
    const createdTerminal: TerminalModel = await this.terminalService.create(business, createTerminalDto);
    const terminalAccessConfigModel: TerminalAccessConfigModel
      = await this.terminalAccessConfigService.findByTerminal(createdTerminal);
    const domain: string = `${terminalAccessConfigModel.internalDomain}.${environment.posDomain}`;
    await this.terminalEventsProducer.terminalCreated(business, createdTerminal, domain);
    await this.eventApplicationProducer.produceApplicationCreatedEvent(business, createdTerminal);

    return createdTerminal;
  }

  @Patch('business/:businessId/terminals/:terminalId')
  public async updateTerminalById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
    @Body() updateTerminalDto: UpdateTerminalDto,
  ): Promise<TerminalModel> {
    if (!(await this.terminalService.isNameAvailable(business, updateTerminalDto.name, terminal))) {
      throw new HttpException('Terminal name not available', HttpStatus.CONFLICT);
    }

    const updatedTerminal: TerminalModel = await this.terminalService.update(terminal, updateTerminalDto);
    await this.terminalEventsProducer.terminalUpdated(business, updatedTerminal);

    return updatedTerminal;
  }

  @Patch('business/:businessId/terminals/:terminalId/active')
  public async setActive(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
  ): Promise<TerminalModel> {
    const updated: TerminalModel = await this.terminalService.setActive(business, terminal);

    await terminal.populate('channelSets').execPopulate();
    await this.channelEventsProducer.sendChannelSetActivated(terminal.channelSet, business);

    return updated;
  }

  @Patch('terminals/:terminalId/config')
  public async updateAccessConfig(
    @ParamModel(':terminalId', TerminalSchemaName, true) terminal: TerminalModel,
    @Body() dto: UpdateAccessConfigDto,
  ): Promise<TerminalAccessConfigModel> {

    return this.terminalAccessConfigService.createOrUpdate(terminal, dto);
  }

  @Delete('terminals/:terminalId')
  public async removeById(
    @ParamModel(':terminalId', TerminalSchemaName, true) terminal: TerminalModel,
    @Param('terminalId') swagger__shopId: string,
  ): Promise<void> {
    await terminal.populate('business').execPopulate();
    const businessId: string = terminal.business._id;
    terminal.depopulate('business');

    const business: BusinessModel = await this.businessService.findOneById(businessId);

    const removed: boolean = await this.terminalService.removeInBusiness(business, terminal);
    if (removed) {
      await this.terminalEventsProducer.terminalRemoved(business, terminal);
      await this.eventApplicationProducer.produceApplicationRemovedEvent(terminal);
    }
  }
}
