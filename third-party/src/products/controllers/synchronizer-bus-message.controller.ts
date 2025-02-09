import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IntegrationActionRequestDto, IntegrationBusActionService } from '@pe/third-party-sdk';

@Controller()
export class SynchronizerBusMessageController {
  constructor(
    private readonly actionService: IntegrationBusActionService,
  ) { }

  @MessagePattern({
    name: 'synchronizer.event.action.call',
  })
  public async actionCall(dto: IntegrationActionRequestDto): Promise<void> {
    return this.actionService.callAction(dto);
  }
}
