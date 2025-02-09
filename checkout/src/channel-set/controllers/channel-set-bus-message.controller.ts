import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { validate } from 'class-validator';
import { BusinessEventsEnum, BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { CheckoutEvent, CheckoutModel } from '../../checkout';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import {
  ChannelSetActivatedDto,
  ChannelSetCreatedDto,
  ChannelSetExportedDto,
  ChannelSetNamedDto,
  CheckoutChannelSetCreatedDto,
  DeletedChannelDto,
  LegacyChannelSetMigrateDto,
} from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';
import { EventDispatcher } from '@pe/nest-kit';
import { RabbitEventsProducer } from '../../common/producer';
import { CheckoutDbService } from '../../common/services';

@Controller()
export class ChannelSetBusMessageController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelSetService: ChannelSetService,
    private readonly checkoutDbService: CheckoutDbService,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetCreated,
  })
  public async onChannelSetCreateEvent(createChannelSetDto: ChannelSetCreatedDto): Promise<void> {
    try {
      await this.channelSetCreated(createChannelSetDto);
    } catch (e) {
      this.logger.warn(
        {
          businessId: createChannelSetDto.business.id,
          channelSetId: createChannelSetDto.id,
          error: e.message,
          message: 'Failed to create checkout channel set projection',
        },
      );
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetUpdated,
  })
  public async onChannelSetUpdateEvent(createChannelSetDto: ChannelSetCreatedDto): Promise<void> {
    await validate(createChannelSetDto);

    await this.channelSetService.update(
      createChannelSetDto.id,
      {
        subType: createChannelSetDto.type,
        type: createChannelSetDto.channel.type,
      },
    );
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetNamed,
  })
  public async onChannelSetNamedEvent(channelSetNamedDto: ChannelSetNamedDto): Promise<void> {
    await validate(channelSetNamedDto);

    await this.channelSetService.createOrUpdateById(
      channelSetNamedDto.id,
      {
        name: channelSetNamedDto.name,
      },
    );
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetDeleted,
  })
  public async onChannelSetDeleteEvent(channelSetDto: DeletedChannelDto): Promise<void> {
    await validate(channelSetDto);

    await this.channelSetService.deleteOneById(channelSetDto._id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetExported,
  })
  public async onChannelSetExportedEvent(channelSetExportedDto: ChannelSetExportedDto): Promise<void> {
    await validate(channelSetExportedDto);

    let business: BusinessModel = await this.businessService
      .findOneById(channelSetExportedDto.businessId) as BusinessModel;

    if (!business) {
      business = await this.businessService.updateById(
        channelSetExportedDto.businessId,
        {
          channelSets: [],
          checkouts: [],
        },
      ) as any;
      await this.eventDispatcher.dispatch(BusinessEventsEnum.BusinessCreated, business);
    }

    const customPolicy: boolean = channelSetExportedDto.customPolicy !== undefined
      ? channelSetExportedDto.customPolicy
      : false
    ;
    const enabledByDefault: boolean = channelSetExportedDto.enabledByDefault !== undefined
      ? channelSetExportedDto.enabledByDefault
      : false
    ;

    const channelSet: ChannelSetModel = await this.channelSetService.createOrUpdate(
      business,
      channelSetExportedDto.id,
      {
        customPolicy: customPolicy,
        enabledByDefault: enabledByDefault,
        type: channelSetExportedDto.type,
      },
    );

    const channelSetCreationWasTriggeredByCheckoutApp: boolean = channelSetExportedDto.enabledByDefault;
    const checkout: CheckoutModel = await this.checkoutDbService.findDefaultForBusiness(business);
    if (!channelSetCreationWasTriggeredByCheckoutApp) {
      await this.channelSetService.applyDefaultCheckout(business, channelSet, checkout);
    } else {
      await this.rabbitEventsProducer.businessCheckoutUpdated(checkout);
    }
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetForCheckoutCreated,
  })
  public async onChannelSetForCheckoutCreateEvent(channelSetCreatedDto: CheckoutChannelSetCreatedDto): Promise<void> {
    await validate(channelSetCreatedDto);
    const checkout: CheckoutModel = await this.checkoutDbService.findOneById(channelSetCreatedDto.checkout);
    if (!checkout) {
      return;
    }

    await this.channelSetService.applyCheckoutToChannelSetId(channelSetCreatedDto.id, checkout);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.ChannelSetActivated,
  })
  public async onChannelSetActivateEvent(dto: ChannelSetActivatedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id)  as BusinessModel;
    if (!business) {
      return;
    }
    const activeChannelSet: ChannelSetModel = await this.channelSetService.findOneById(dto.id);
    if (!activeChannelSet) {
      return;
    }

    await business.populate('channelSets').execPopulate();

    const tasks: Array<Promise<ChannelSetModel>> = [];
    for (const channelSetdata of business.channelSets) {
      const channelSet: ChannelSetModel = channelSetdata as ChannelSetModel;
      if (channelSet.type !== activeChannelSet.type) {
        continue;
      }

      if (channelSet.id === activeChannelSet.id) {
        channelSet.set({ active: true });
      } else {
        channelSet.set({ active: false });
      }

      tasks.push(channelSet.save());
    }

    await Promise.all(tasks);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.LegacyChannelSetMigrate,
  })
  public async onLegacyChannelSetMigrateEvent(dto: { channel_set: LegacyChannelSetMigrateDto }): Promise<void> {
    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(dto.channel_set.uuid);
    if (!channelSet || !dto.channel_set.original_id) {
      return ;
    }

    return this.channelSetService.updateById(channelSet.id, { originalId: dto.channel_set.original_id });
  }

  private async channelSetCreated(createChannelSetDto: ChannelSetCreatedDto): Promise<void> {
    await validate(createChannelSetDto);

    let business: BusinessModel = await this.businessService
      .findOneById(createChannelSetDto.business.id) as BusinessModel;

    if (!business) {
      business = await this.businessService.updateById(
        createChannelSetDto.business.id,
        {
          channelSets: [],
          checkouts: [],
        },
      ) as any;
      await this.eventDispatcher.dispatch(BusinessEventsEnum.BusinessCreated, business);
    }

    const customPolicy: boolean = createChannelSetDto.channel.customPolicy !== undefined
      ? createChannelSetDto.channel.customPolicy
      : false
    ;
    const enabledByDefault: boolean = createChannelSetDto.channel.enabledByDefault !== undefined
      ? createChannelSetDto.channel.enabledByDefault
      : false
    ;

    const channelSet: ChannelSetModel = await this.channelSetService.createOrUpdate(
      business,
      createChannelSetDto.id,
      {
        customPolicy: customPolicy,
        enabledByDefault: enabledByDefault,
        subType: createChannelSetDto.type,
        type: createChannelSetDto.channel.type,
      },
    );

    const channelSetCreationWasTriggeredByCheckoutApp: boolean = createChannelSetDto.channel.enabledByDefault;
    let checkout: CheckoutModel = await this.checkoutDbService.findDefaultForBusiness(business);
    if (!checkout) {
      await this.eventDispatcher.dispatch(CheckoutEvent.CheckAndCreateDefaultCheckout, business);
      checkout = await this.checkoutDbService.findDefaultForBusiness(business);
    }

    if (!channelSetCreationWasTriggeredByCheckoutApp) {
      await this.channelSetService.applyDefaultCheckout(business, channelSet, checkout);
    } else {
      await this.rabbitEventsProducer.businessCheckoutUpdated(checkout);
    }
  }
}
