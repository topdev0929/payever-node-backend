import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChannelEventMessagesProducer } from '@pe/channels-sdk';
import { Acl, AclActionsEnum, ParamModel, RabbitMqClient } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { CreateTerminalDto, UpdateTerminalDto } from '../dto';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { EventApplicationProducer, TerminalRabbitEventsProducer } from '../producers';
import { TerminalAccessConfigService, TerminalService } from '../services';
import { environment } from '../../environments';

@Controller('business/:businessId/terminal')
@UseGuards(JwtAuthGuard)
@ApiTags('terminal')
export class TerminalController {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly terminalService: TerminalService,
    private readonly terminalEventsProducer: TerminalRabbitEventsProducer,
    private readonly eventApplicationProducer: EventApplicationProducer,
    private readonly channelEventsProducer: ChannelEventMessagesProducer,
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
  ) { }

  @Get('isValidName')
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  @Roles(RolesEnum.merchant)
  public async isValidName(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Query('name') name: string,
  ): Promise<{
    result: boolean;
    message?: string;
  }> {
    if (!name) {
      throw new Error(`Query param "name" is required`);
    }

    try {
      if (!(await this.terminalService.isNameAvailable(business, name))) {
        return { result: false };
      }

      return { result: true };
    } catch (e) {
      return {
        message: (e && e.message) ? e.message : '',
        result: false,
      };
    }
  }

  @Get('active')
  @Acl({ microservice: 'pos', action: AclActionsEnum.read })
  @Roles(RolesEnum.merchant)
  public async getActivePos(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<{ id: string }> {
    const terminal: TerminalModel = await this.terminalService.getActive(business);

    return {
      id: terminal?._id,
    };
  }

  @Post()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'pos', action: AclActionsEnum.create })
  public async create(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @Body() createTerminalDto: CreateTerminalDto,
  ): Promise<TerminalModel> {
    // for default terminals name should be equal to business name
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

  @Get('/getDefaultLanguage')
  @Roles(RolesEnum.anonymous)
  public async getDefaultLanguage(
    @ParamModel('businessId', BusinessSchemaName, true) business: BusinessModel,
  ): Promise<string> {
    return business.defaultLanguage;
  }

  @Delete(':terminalId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'pos', action: AclActionsEnum.delete })
  public async removeById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
  ): Promise<void> {
    const removed: boolean = await this.terminalService.removeInBusiness(business, terminal);
    if (removed) {
      await this.terminalEventsProducer.terminalRemoved(business, terminal);
      await this.eventApplicationProducer.produceApplicationRemovedEvent(terminal);
    }
  }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async findAllByBusiness(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<TerminalModel[]> {
    return (await this
      .terminalService
      .findAllByBusiness(business)
    ).map((terminal: TerminalModel) => {
      terminal.defaultLocale = business.defaultLanguage;

      return terminal;
    });
  }

  @Get(':terminalId')
  @Roles(RolesEnum.anonymous)
  public async findOneById(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
  ): Promise<TerminalModel & { accessConfig: TerminalAccessConfigModel; businessId : string } > {
    await terminal.populate('business').execPopulate();
    const accessConfig: TerminalAccessConfigModel = await this.terminalAccessConfigService.findByTerminal(terminal);

    return {
      ...terminal.toObject(),
      accessConfig: accessConfig,
      businessId: business.id,
      defaultLocale: business.defaultLanguage,
    } as (TerminalModel & { accessConfig: TerminalAccessConfigModel; businessId : string });
  }

  @Patch(':terminalId')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'pos', action: AclActionsEnum.update })
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

  @Patch(':terminalId/active')
  @Roles(RolesEnum.merchant)
  @Acl(
    { microservice: 'pos', action: AclActionsEnum.create },
    { microservice: 'pos', action: AclActionsEnum.update },
  )
  public async setActive(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('terminalId', TerminalSchemaName) terminal: TerminalModel,
  ): Promise<TerminalModel> {
    const updated: TerminalModel = await this.terminalService.setActive(business, terminal);

    await terminal.populate('channelSets').execPopulate();
    await this.channelEventsProducer.sendChannelSetActivated(terminal.channelSet, business);

    return updated;
  }
}
