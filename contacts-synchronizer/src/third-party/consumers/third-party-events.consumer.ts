import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ThirdPartyEventsEnum } from '../enums';

@Controller()
export class ThirdPartyEventsConsumer {
  @MessagePattern({
    name: ThirdPartyEventsEnum.Connected,
  })
  public async thirdPartyConnected(): Promise<void> {
    //  Not implemented
  }

  @MessagePattern({
    name: ThirdPartyEventsEnum.Disconnected,
  })
  public async thirdPartyDisconnected(): Promise<void> {
    //  Not implemented
  }
}
