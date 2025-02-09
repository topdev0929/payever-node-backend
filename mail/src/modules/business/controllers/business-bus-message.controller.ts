import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding } from '../../../environments/rabbit-mq-binding.enum';
import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessService } from '../services';
import { RabbitChannelsEnum } from '../../../rabbitmq';
import { MailService } from '../../mail/services';

@Controller()
export class BusinessBusMessageController {

  constructor(
    private readonly businessService: BusinessService,
    private readonly mailService: MailService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Marketing,
    name: RabbitBinding.BusinessCreated,
  })
  public async onBusinessCreateEvent(createBusinessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(createBusinessDto);
    await this.mailService.createByBusiness(createBusinessDto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Marketing,
    name: RabbitBinding.BusinessRemoved,
  })
  public async onBusinessRemoveEvent(data: RemoveBusinessDto): Promise<void> {
    await this.businessService.deleteOneById(data._id);
    await this.mailService.removeById(data._id);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Marketing,
    name: RabbitBinding.BusinessUpdated,
  })
  public async onBusinessUpdateEvent(updateBusinessDto: BusinessDto): Promise<void> {
    return this.businessService.updateById(updateBusinessDto._id, updateBusinessDto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Marketing,
    name: RabbitBinding.BusinessExport,
  })
  public async onBusinessExport(createBusinessDto: BusinessDto): Promise<void> {
    await this.businessService.upsert(createBusinessDto);
    await this.mailService.exportByBusiness(createBusinessDto);
  }
}
