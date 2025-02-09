import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PosService } from '../services';
import { CreateTerminalDto, RemoveTerminalDto } from '../dto';
import { PosRabbitMessagesEnum } from '../enums/pos-rabbit-messages.enum';
import { SetDefaultTerminalDto } from '../dto/set-default-terminal.dto';
import { DomainUpdateDto } from '../dto/domain-update.dto';
import { MessageBusChannelsEnum } from '../../environments/rabbitmq';

@Controller()
export class PosMessagesConsumer {
  constructor(
    private readonly posService: PosService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: PosRabbitMessagesEnum.PosTerminalCreated,
  })
  public async onTerminalCreateEvent(dto: CreateTerminalDto): Promise<void> {
    await this.posService.create(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: PosRabbitMessagesEnum.PosTerminalRemoved,
  })
  public async onTerminalRemoveEvent(dto: RemoveTerminalDto): Promise<void> {
    await this.posService.removeById(dto.id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: PosRabbitMessagesEnum.PosTerminalUpdated,
  })
  public async onTerminalUpdateEvent(dto: CreateTerminalDto): Promise<void> {
    await this.posService.upsert(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: PosRabbitMessagesEnum.PosTerminalExported,
  })
  public async onTerminalExportEvent(dto: CreateTerminalDto): Promise<void> {
    await this.posService.upsert(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: PosRabbitMessagesEnum.PosDomainUpdated,
  })
  public async onPosDomainUpdated(dto: DomainUpdateDto): Promise<void> {
    await this.posService.updateDomain(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: PosRabbitMessagesEnum.SetDefaultTerminal,
  })
  public async onSetDefaultTerminal(dto: SetDefaultTerminalDto): Promise<void> {
    await this.posService.setDefaultTerminal(dto);
  }
}
