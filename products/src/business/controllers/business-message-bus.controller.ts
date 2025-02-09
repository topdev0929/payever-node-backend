import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessService } from '../services';
import { BusinessEventsEnums } from '../enums';
import { EventDispatcher } from '@pe/nest-kit';
import { MessageBusChannelsEnum } from '../../shared';

@Controller()
export class BusinessMessageBusController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'users.event.business.created',
  })
  public async onBusinessCreated(businessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(businessDto);
    await this.eventDispatcher.dispatch(BusinessEventsEnums.BusinessCreated, businessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'users.event.business.updated',
  })
  public async onBusinessUpdated(businessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(businessDto);
    await this.eventDispatcher.dispatch(BusinessEventsEnums.BusinessUpdated, businessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'users.event.business.export',
  })
  public async onBusinessExport(businessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(businessDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'users.event.business.removed',
  })
  public async onBusinessRemoveEvent(data: RemoveBusinessDto): Promise<void> {
    await this.businessService.remove(data);
  }
}
