import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BusinessModel } from '@pe/business-kit';
import { EventSubscriptionDto } from '../dto';
import { AppModel, EventSubscriptionModel } from '../models';
import { EventSubscriptionEventsProducer } from '../producers';
import { EventSubscriptionSchemaName } from '../schemas';

@Injectable()
export class EventSubscriptionService {
  constructor(
    @InjectModel(EventSubscriptionSchemaName)
    private readonly eventSubscriptionModel: Model<EventSubscriptionModel>,
    private readonly eventSubscriptionEventsProducer: EventSubscriptionEventsProducer,
  ) { }

  public async updateEventSubscription(
    business: BusinessModel,
    app: AppModel,
    dto: EventSubscriptionDto,
  ): Promise<EventSubscriptionModel> {
    const appSubscription: EventSubscriptionModel = await this.eventSubscriptionModel.findOneAndUpdate(
      {
        appId: app._id,
        businessId: business._id,
      },
      {
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );

    let events: string[] = appSubscription.events;
    if (dto.events && Array.isArray(dto.events)) {
      events = [];
      dto.events.forEach((event: string) => {
        if (app.events.indexOf(event) !== -1) {
          events.push(event);
        }
      });
    }

    const updatedAppSubscription: EventSubscriptionModel = await this.eventSubscriptionModel.findOneAndUpdate(
      {
        appId: app._id,
        businessId: business._id,
      },
      {
        $set: {
          ...dto,
          events,
        },
      },
      {
        new: true,
      },
    );

    await this.eventSubscriptionEventsProducer.eventSubscriptionUpdatedEvent(updatedAppSubscription);

    return updatedAppSubscription;
  }
}
