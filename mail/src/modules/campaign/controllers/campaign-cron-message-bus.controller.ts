import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitMessage } from '../enums';
import { CampaignCronService } from '../services';
import { CreateCampaignCronDto } from '../dto';

@Controller()
export class CampaignCronMessageBusController {
  constructor(
    private campaignCronService: CampaignCronService,
  ) { }

  @MessagePattern({
    name: RabbitMessage.CampaignCronAdd,
  })
  public async onCampaignCronAdd(data: CreateCampaignCronDto): Promise<void> {
    await this.campaignCronService.createCampaignCron(data);
  }
}
