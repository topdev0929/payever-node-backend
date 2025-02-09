import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessService } from '../services';
import { MessageBusChannelsEnum } from '../../checkout-analytics';

@Controller()
export class BusinessMessageBusController {
  constructor(
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: 'users.event.business.created',
  })
  public async onBusinessCreated(businessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(businessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: 'users.event.business.updated',
  })
  public async onBusinessUpdated(businessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(businessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: 'users.event.business.export',
  })
  public async onBusinessExport(businessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(businessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
    name: 'users.event.business.removed',
  })
  public async onBusinessRemoveEvent(data: RemoveBusinessDto): Promise<void> {
    await this.businessService.remove(data);
  }
}
