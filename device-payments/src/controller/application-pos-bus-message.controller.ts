import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationEnum, RabbitMessagesEnum } from '../enum';
import { ApplicationModel, BusinessModel } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName } from '../schemas';
import { ApplicationService } from '../services/application.service';
import { CreateTerminalDto, RemoveTerminalDto, SetDefaultTerminalDto } from '../dto';

@Controller()
export class ApplicationPosBusMessageController {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly applicationService: ApplicationService,
    private readonly logger: Logger,
  ) {
  }

  @MessagePattern({
    name: RabbitMessagesEnum.PosTerminalSetDefault,
  })
  public async onDefaultTerminalSetEvent(data: SetDefaultTerminalDto): Promise<void> {
    this.logger.log('Received setDefaultTerminal message', JSON.stringify(data));

    await this.applicationService.setDefaultApplication(data.businessId, data.terminalId, ApplicationEnum.pos);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.PosTerminalCreated,
  })
  public async onTerminalCreatedEvent(data: CreateTerminalDto): Promise<void> {
    this.logger.log('Received terminal created message', JSON.stringify(data));
    await this.applicationService.onApplicationEvent(data, ApplicationEnum.pos);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.PosTerminalExport,
  })
  public async onTerminalExportEvent(data: CreateTerminalDto): Promise<void> {
    this.logger.log('Received terminal export message', JSON.stringify(data));
    await this.applicationService.onApplicationEvent(data, ApplicationEnum.pos);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.PosTerminalUpdated,
  })
  public async onTerminalUpdatedEvent(data: CreateTerminalDto): Promise<void> {
    this.logger.log('Received terminal updated message', JSON.stringify(data));
    await this.applicationService.onApplicationEvent(data, ApplicationEnum.pos);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.PosTerminalRemoved,
  })
  public async onTerminalRemovedEvent(data: RemoveTerminalDto): Promise<void> {
    await this.applicationService.deleteByApplicationId(data.id);
  }
}
