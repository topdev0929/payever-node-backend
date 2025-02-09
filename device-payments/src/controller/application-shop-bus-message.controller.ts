import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApplicationEnum, RabbitMessagesEnum } from '../enum';
import { ApplicationModel, BusinessModel } from '../interfaces';
import { ApplicationSchemaName, BusinessSchemaName } from '../schemas';
import { ApplicationService } from '../services/application.service';

@Controller()
export class ApplicationShopBusMessageController {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly applicationService: ApplicationService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    name: RabbitMessagesEnum.shopEventShopLiveToggled,
  })
  public async onDefaultApplicationSetEvent(data: any): Promise<void> {
    this.logger.log('Received shopEventShopLiveToggled message', JSON.stringify(data));

    if (!data.live) {
      return ;
    }

    await this.applicationService.setDefaultApplication(data.businessId, data.shopId, ApplicationEnum.shop);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.shopCreated,
  })
  public async onApplicationCreatedEvent(data: any): Promise<void> {
    this.logger.log('Received application created message', JSON.stringify(data));
    await this.applicationService.onApplicationEvent(data, ApplicationEnum.shop);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.shopExport,
  })
  public async onApplicationExportEvent(data: any): Promise<void> {
    this.logger.log('Received application export message', JSON.stringify(data));
    await this.applicationService.onApplicationEvent(data, ApplicationEnum.shop);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.shopUpdated,
  })
  public async onApplicationUpdatedEvent(data: any): Promise<void> {
    this.logger.log('Received application updated message', JSON.stringify(data));
    await this.applicationService.onApplicationEvent(data, ApplicationEnum.shop);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.shopRemoved,
  })
  public async onApplicationRemovedEvent(data: any): Promise<void> {
    await this.applicationService.deleteByApplicationId(data.id || data._id);
  }
}
