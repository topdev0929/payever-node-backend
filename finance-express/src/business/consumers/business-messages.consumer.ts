import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessDto, RemoveBusinessDto } from '../dto';
import { BusinessService } from '../services';
import { BusinessRabbitMessagesEnum } from '../enums';
import { validate } from 'class-validator';
import { BusinessModel } from '../interfaces/entities';

@Controller()
export class BusinessMessagesConsumer {
  constructor(
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    name: BusinessRabbitMessagesEnum.BusinessCreated,
  })
  public async onBusinessCreateEvent(createBusinessDto: BusinessDto): Promise<void> {
    await this.businessService.create(createBusinessDto);
  }

  @MessagePattern({
    name: BusinessRabbitMessagesEnum.BusinessDeleted,
  })
  public async onBusinessRemoveEvent(dto: RemoveBusinessDto): Promise<void> {
    await this.businessService.deleteOneById(dto._id);
  }

  @MessagePattern({
    name: BusinessRabbitMessagesEnum.BusinessUpdated,
  })
  public async onBusinessUpdateEvent(updateBusinessDto: BusinessDto): Promise<void> {
    await this.businessService.updateById(updateBusinessDto._id, updateBusinessDto);
  }

  @MessagePattern({
    name: BusinessRabbitMessagesEnum.BusinessExported,
  })
  public async onBusinessExportEvent(exportBusinessDto: BusinessDto): Promise<void> {
    await validate(exportBusinessDto);

    const business: BusinessModel = await this.businessService.findOneById(exportBusinessDto._id);
    if (!business) {
      await this.businessService.create(exportBusinessDto);
    }

    await this.businessService.updateById(exportBusinessDto._id, exportBusinessDto);
  }
}
