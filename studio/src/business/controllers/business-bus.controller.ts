import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { EventDispatcher } from '@pe/nest-kit';
import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessService } from '../services';
import { RabbitMqEnum } from '../../environments';
import { BusinessEventsEnums } from '../enums';
import { UserAlbumService } from '../../studio/services';
import { BusinessModel } from '../models';
import { RabbitChannelsEnum } from '../../studio/enums';

@Controller()
export class BusinessBusController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly userAlbumService: UserAlbumService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Studio,
    name: RabbitMqEnum.BusinessCreated,
  })
  public async onBusinessCreateEvent(createBusinessDto: BusinessDto): Promise<void> {
    await validate(createBusinessDto);
    const business: BusinessModel = await this.businessService.create(createBusinessDto);
    await this.userAlbumService.createDefault(business);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Studio,
    name: RabbitMqEnum.BusinessRemoved,
  })
  public async onBusinessRemoveEvent(removeBusinessDto: RemoveBusinessDto): Promise<void> {
    await this.businessService.deleteOneById(removeBusinessDto._id);
    await this.eventDispatcher.dispatch(BusinessEventsEnums.BusinessRemoved, removeBusinessDto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Studio,
    name: RabbitMqEnum.BusinessUpdated,
  })
  public async onBusinessUpdateEvent(updateBusinessDto: BusinessDto): Promise<void> {
    await validate(updateBusinessDto);

    await this.businessService.updateById(updateBusinessDto._id, updateBusinessDto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Studio,
    name: RabbitMqEnum.BusinessExported,
  })
  public async onBusinessExport(businessDto: BusinessDto): Promise<void> {
    await this.businessService.createOrUpdate(businessDto);
  }
}
