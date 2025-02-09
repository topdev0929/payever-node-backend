import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { RabbitChannelsEnum, RabbitEventNameEnum } from '../../environments/rabbitmq';
import { ChannelSetCreatedEventDto, ChannelSetRemovedEventDto } from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';

@Controller()
export class ChannelSetBusMessageController {
  constructor(
    private readonly channelSetService: ChannelSetService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.ChannelSetCreated,
  })
  public async onChannelSetCreated(channelSetCreatedEventDto: ChannelSetCreatedEventDto): Promise<void> {
    await validate(channelSetCreatedEventDto);
    const channelSet: ChannelSetModel = {
      _id: channelSetCreatedEventDto.id,
      businessId: channelSetCreatedEventDto.business.id,
      type: channelSetCreatedEventDto.channel.type,
    } as ChannelSetModel;
    await this.channelSetService.create(channelSet);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.ChannelSetDeleted,
  })
  public async onChannelSetRemoved(channelSetRemovedEventDto: ChannelSetRemovedEventDto): Promise<void> {
    await validate(channelSetRemovedEventDto);
    await this.channelSetService.remove(channelSetRemovedEventDto._id);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Shipping,
    name: RabbitEventNameEnum.CheckoutEventChannelSetByBusinessExport,
  })
  public async onCheckoutEventChannelSetByBusinessExport(
    channelSetCreatedEventDto: ChannelSetCreatedEventDto,
  ): Promise<void> {
    await validate(channelSetCreatedEventDto);
    const channelSet: ChannelSetModel = {
      _id: channelSetCreatedEventDto.id,
      businessId: channelSetCreatedEventDto.business.id,
      type: channelSetCreatedEventDto.channel.type,
    } as ChannelSetModel;
    const existingChannelSet: ChannelSetModel = await this.channelSetService.findOneById(channelSetCreatedEventDto.id);

    if (existingChannelSet) { return; }
    await this.channelSetService.create(channelSet);
  }
}
