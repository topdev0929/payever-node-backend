import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessDto, BusinessRemoveDto } from '../dto';
import { BusinessService } from '../services/business.service';
import { MessageBusChannelsEnum } from '../../environments/rabbitmq.enum';
import { BusinessModel } from '../../models/business.model';

@Controller()
export class BusinessBusMessageController {
  constructor(private readonly businessService: BusinessService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.commerceos,
    name: 'users.event.business.created',
  })
  public async onBusinessCreateEvent(createBusinessDto: BusinessDto): Promise<void> {
    await this.businessService.create(createBusinessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.commerceos,
    name: 'users.event.business.updated',
  })
  public async onBusinessUpdateEvent(updateBusinessDto: BusinessDto): Promise<void> {
    await this.businessService.update(updateBusinessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.commerceos,
    name: 'users.event.business.removed',
  })
  public async onBusinessRemoveEvent(data: BusinessRemoveDto): Promise<void> {
    await this.businessService.deleteOneById(data._id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.commerceos,
    name: 'users.event.business.export',
  })
  public async onBusinessExportEvent(dto: BusinessDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto._id);

    if (business) {
      await this.businessService.update(dto);
    } else {
      await this.businessService.create(dto);
    }
  }
}
