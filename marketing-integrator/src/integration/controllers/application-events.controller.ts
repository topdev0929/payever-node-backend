import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitRoutingKeysEnum } from '../enum';
import { BusinessSynchronizerService } from '../services';
import { AppInstallationDto } from '../dto';

@Controller()
export class ApplicationEventsController {
  constructor(
    private readonly businessSyncrhonizerService: BusinessSynchronizerService,
  ) { }

  @MessagePattern({
    name: RabbitRoutingKeysEnum.ApplicationInstalled,
  })
  public async onAppInstalled(dto: AppInstallationDto): Promise<void> {
    await this.businessSyncrhonizerService.syncBusinessUserAccountWithCrmContact(dto.businessId);
  }

  @MessagePattern({
    name: RabbitRoutingKeysEnum.ApplicationUninstalled,
  })
  public async onAppUninstalled(dto: AppInstallationDto): Promise<void> {
    await this.businessSyncrhonizerService.syncBusinessUserAccountWithCrmContact(dto.businessId);
  }
}
