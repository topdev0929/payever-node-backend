import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { IntegrationService } from '../services';
import { RabbitChannelEnum } from '../../environments';
import { AutoDiscoveryEventsEnum } from '../enum';
import { IntegrationDto } from '../dto';

@Controller()
export class AutoDiscoveryConsumer {
  constructor(
    private readonly integrationService: IntegrationService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: AutoDiscoveryEventsEnum.upsert,
  })
  public async install(payload: IntegrationDto): Promise<void> {
    await this.integrationService.upsert(payload);
  }
}
