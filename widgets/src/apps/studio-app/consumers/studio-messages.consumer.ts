import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessMediaService } from '../services';
import { StudioRabbitMessagesEnum } from '../enums';
import { BusinessMediaDto, BusinessMediaReferenceDto } from '../dto';

@Controller()
export class StudioMessagesConsumer {
  constructor(
    private readonly businessMediaService: BusinessMediaService,
  ) { }

  @MessagePattern({
    name: StudioRabbitMessagesEnum.BusinessMediaCreated,
  })
  public async onCreated(data: BusinessMediaDto): Promise<void> {
    await this.businessMediaService.createOrUpdate(data);
  }

  @MessagePattern({
    name: StudioRabbitMessagesEnum.BusinessMediaUpdated,
  })
  public async onUpdated(data: BusinessMediaDto): Promise<void> {
    await this.businessMediaService.createOrUpdate(data);
  }

  @MessagePattern({
    name: StudioRabbitMessagesEnum.BusinessMediaDeleted,
  })
  public async onDeleted(data: BusinessMediaReferenceDto): Promise<void> {
    await this.businessMediaService.delete(data);
  }
}
