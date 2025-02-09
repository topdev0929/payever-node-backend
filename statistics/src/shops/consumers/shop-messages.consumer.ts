import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ShopRabbitMessagesEnum } from '../enums';
import { ShopService } from '../services';
import { CreateShopDto, RemoveShopDto } from '../dto';
import { DomainUpdateDto } from '../dto/domain-update.dto';
import { SetDefaultShopDto } from '../dto/set-default-shop.dto';
import { MessageBusChannelsEnum } from '../../environments/rabbitmq';

@Controller()
export class ShopMessagesConsumer {
  constructor(
    private readonly shopService: ShopService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: ShopRabbitMessagesEnum.ShopCreated,
  })
  public async onShopCreateEvent(dto: CreateShopDto): Promise<void> {
    await this.shopService.create(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: ShopRabbitMessagesEnum.ShopRemoved,
  })
  public async onShopRemoveEvent(dto: RemoveShopDto): Promise<void> {
    await this.shopService.removeById(dto.id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: ShopRabbitMessagesEnum.ShopUpdated,
  })
  public async onShopUpdateEvent(dto: CreateShopDto): Promise<void> {
    await this.shopService.upsert(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: ShopRabbitMessagesEnum.ShopExport,
  })
  public async onShopExportEvent(dto: CreateShopDto): Promise<void> {
    await this.shopService.upsert(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: ShopRabbitMessagesEnum.DomainUpdated,
  })
  public async onShopDomainUpdated(dto: DomainUpdateDto): Promise<void> {
    await this.shopService.updateDomain(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: ShopRabbitMessagesEnum.SetDefaultShop,
  })
  public async onSetDefaultTerminal(dto: SetDefaultShopDto): Promise<void> {
    await this.shopService.setDefaultShop(dto);
  }
}
