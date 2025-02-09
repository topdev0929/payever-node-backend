import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PosService } from '../services';
import { PosRabbitMessagesEnum } from '../enums';
import { PosTerminalEventDto } from '../dto';

@Controller()
export class PosMessagesConsumer {
  constructor(
    private readonly posService: PosService,
  ) { }

  @MessagePattern({
    name: PosRabbitMessagesEnum.terminalCreated,
  })
  public async onTerminalCreated(data: PosTerminalEventDto): Promise<void> {
    await this.posService.createOrUpdateTerminalFromEvent(data);
  }

  @MessagePattern({
    name: PosRabbitMessagesEnum.terminalUpdated,
  })
  public async onTerminalUpdated(data: PosTerminalEventDto): Promise<void> {
    await this.posService.createOrUpdateTerminalFromEvent(data);
  }

  @MessagePattern({
    name: PosRabbitMessagesEnum.terminalExport,
  })
  public async onTerminalExport(data: PosTerminalEventDto): Promise<void> {
    await this.posService.createOrUpdateTerminalFromEvent(data);
  }

  @MessagePattern({
    name: PosRabbitMessagesEnum.terminalRemoved,
  })
  public async onTerminalDeleted(data: PosTerminalEventDto): Promise<void> {
    await this.posService.deleteTerminal(data);
  }
}
