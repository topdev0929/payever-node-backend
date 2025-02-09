import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../message/enums';
import { InstalledAppUpdateDto } from '../dto';
import { AppRegistryEventNameEnum } from '../enums';
import { BusinessService } from '@pe/business-kit';



@Injectable()
@Controller()
export class BusinessInstalledAppsConsumer {
  constructor(
    private readonly businessService: BusinessService,
  ) { }


  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: AppRegistryEventNameEnum.ApplicationInstalled,
  })
  public async onApplicationInstalled(dto: InstalledAppUpdateDto): Promise<void> {
    if (dto.code !== 'message') {
      return;
    }

    await this.businessService.updateById(dto.businessId, {
      hasMessageApp: true,
    });
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: AppRegistryEventNameEnum.ApplicationUnInstalled,
  })
  public async onApplicationUninstalled(dto: InstalledAppUpdateDto): Promise<void> {
    if (dto.code !== 'message') {
      return;
    }

    await this.businessService.updateById(dto.businessId, {
      hasMessageApp: false,
    });
  }
}
