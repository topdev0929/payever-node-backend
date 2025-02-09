import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ShopService } from '../services';
import { ShopRabbitMessagesEnum } from '../enums';
import { ShopEventDto } from '../dto';

@Controller()
export class ShopMessagesConsumer {
  constructor(
    private readonly shopService: ShopService,
  ) { }

  @MessagePattern({
    name: ShopRabbitMessagesEnum.shopCreated,
  })
  public async onShopCreated(data: ShopEventDto): Promise<void> {
    await this.shopService.createOrUpdateShopFromEvent(data);
  }

  @MessagePattern({
    name: ShopRabbitMessagesEnum.shopUpdated,
  })
  public async onShopUpdated(data: ShopEventDto): Promise<void> {
    await this.shopService.createOrUpdateShopFromEvent(data);
  }

  @MessagePattern({
    name: ShopRabbitMessagesEnum.shopExport,
  })
  public async onShopExport(data: ShopEventDto): Promise<void> {
    await this.shopService.createOrUpdateShopFromEvent(data);
  }

  @MessagePattern({
    name: ShopRabbitMessagesEnum.shopRemoved,
  })
  public async onTerminalDeleted(data: ShopEventDto): Promise<void> {
    await this.shopService.deleteShop(data);
  }
}
