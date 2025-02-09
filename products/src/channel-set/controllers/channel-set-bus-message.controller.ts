import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessModel, BusinessService } from '../../business';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { ActivatedChannelSetDto, CreatedChannelSetDto, DeletedChannelSetDto, NamedChannelSetDto } from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';
import { ChannelSetExportedDto } from '../../marketplace/dto';
import { EventDispatcher } from '@pe/nest-kit';
import { ChannelSetEventEnum } from '../enums';
import { MessageBusChannelsEnum } from '../../shared';
import { Mutex } from '@pe/nest-kit/modules/mutex';

export const channelSetBlackList: string[] = ['link', 'finance_express'];
const mutexKey: string = 'product-channel-set';

@Controller()
export class ChannelSetBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelSetService: ChannelSetService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly mutex: Mutex,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ChannelSetCreated,
  })
  public async onChannelSetCreateEvent(createChannelSetDto: CreatedChannelSetDto): Promise<void> {
    if (channelSetBlackList.includes(createChannelSetDto.channel.type)) {
      return;
    }
    await this.channelSetService.findOneUpdateOrUpsert(
      createChannelSetDto.id,
      {
        customPolicy: createChannelSetDto.channel.customPolicy || false,
        enabledByDefault: createChannelSetDto.channel.enabledByDefault || false,
        businessId: createChannelSetDto.business.id,
        type: createChannelSetDto.channel.type,
      },
    );
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ChannelSetNamed,
  })
  public async onChannelSetNamedEvent(channelSetNamedDto: NamedChannelSetDto): Promise<void> {
    await this.channelSetService.findOneUpdateOrUpsert(
      channelSetNamedDto.id,
      {
        name: channelSetNamedDto.name,
      },
    );
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ChannelSetDeleted,
  })
  public async onChannelSetDeleteEvent(channelSetDto: DeletedChannelSetDto): Promise<void> {
    await validate(channelSetDto);

    await this.channelSetService.deleteOneById(channelSetDto._id);
    await this.eventDispatcher.dispatch(ChannelSetEventEnum.ChannelSetDeleted, channelSetDto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ChannelSetActivated,
  })
  public async onChannelSetActivateEvent(dto: ActivatedChannelSetDto): Promise<void> {
    const business: BusinessModel = await this.businessService.getById(dto.business.id);
    if (!business) {
      return;
    }
    const activeChannelSet: ChannelSetModel = await this.channelSetService.findOneById(dto.id);
    if (!activeChannelSet) {
      return;
    }

    const channelSetSameTypes: ChannelSetModel[] =
        await this.channelSetService.findByTypeAndBusiness(activeChannelSet.type, business);

    const tasks: Array<Promise<ChannelSetModel>> = [];
    channelSetSameTypes.forEach((channelSet: ChannelSetModel) => {
      if (channelSet.id === activeChannelSet.id) {
        channelSet.set({ active: true });
      } else {
        channelSet.set({ active: false });
      }
      tasks.push(channelSet.save());
    });
    await Promise.all(tasks);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: RabbitEventNameEnum.ChannelSetExported,
  })
  public async onChannelSetExportEvent(dto: ChannelSetExportedDto): Promise<void> {
    await this.mutex.lock(
      mutexKey,
      dto.id,
      async () => this.channelSetService.updateOrUpsertById(
        dto.id,
        {
          businessId: dto.businessId,
          name: dto.name,
          type: dto.type,
        },
        { },
      ),
    );
  }
}
