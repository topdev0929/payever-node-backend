import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessService } from '@pe/business-kit';
import { ChannelService, ChannelModel } from '@pe/channels-sdk';
import { RpcCreateApiKeyDto, RpcGetApiKeysDto } from '../dto';
import { ShopSystemModel } from '../models';
import { ShopSystemApiKeyService, ShopSystemService } from '../services';
import { BusinessModel } from '../../business/models';

@Controller()
export class ShopSystemApiKeyConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelService: ChannelService,
    private readonly apiKeyService: ShopSystemApiKeyService,
    private readonly shopSystemService: ShopSystemService,
  ) { }

  @MessagePattern({
    name: 'plugins.rpc.shopsystem.api-keys',
  })
  public async getApiKeys(dto: RpcGetApiKeysDto): Promise<string[]> {
    const business: BusinessModel =
      await this.businessService.findOneById(dto.businessId) as unknown as BusinessModel;
    const channel: ChannelModel = await this.channelService.findOneByType(dto.channelType);

    const shopSystem: ShopSystemModel = await this.shopSystemService.findOneByChannelAndBusiness(channel, business);
    if (!shopSystem) {
      throw new NotFoundException(
        `Shop system integration for business with id '${business.id}' `
        + `and channel of type '${channel.type}' not found'`,
      );
    }

    return this.apiKeyService.findAllByShopSystem(shopSystem);
  }

  @MessagePattern({
    name: 'plugins.rpc.shopsystem.create-api-key',
  })
  public async addApiKey(dto: RpcCreateApiKeyDto): Promise<void> {
    const business: BusinessModel =
      await this.businessService.findOneById(dto.businessId) as unknown as BusinessModel;
    const channel: ChannelModel = await this.channelService.findOneByType(dto.channelType);

    const shopSystem: ShopSystemModel = await this.shopSystemService.findOneByChannelAndBusiness(channel, business);
    if (!shopSystem) {
      throw new NotFoundException(
        `Shop system integration for business with id '${business.id}' `
        + `and channel of type '${channel.type}' not found'`,
      );
    }

    await this.apiKeyService.create(shopSystem, dto);
  }
}
