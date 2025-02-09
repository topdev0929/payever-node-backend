import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitMqClient } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { EditDto } from '../dto/edit.dto';
import { RegisterAppDto } from '../dto/register-app.dto';
import { OrderAppDto } from '../dto/order-app.dto';
import { AppModel } from '../interfaces/app.model';

@Injectable()
export class AppsService {
  constructor(
    @InjectModel('App') private readonly appModel: Model<AppModel>,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async get(): Promise<AppModel[]> {
    return this.appModel.find().exec();
  }

  public async edit(id: string, dto: EditDto): Promise<AppModel> {
    return this.appModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  public async create(registerAppDto: RegisterAppDto): Promise<void> {
    if (registerAppDto.url) {
      // TODO: remove this if when all frontend apps use new API dto
      await this.migrateFromOldAPI(registerAppDto);
    }

    const app: AppModel = await this.appModel.findOneAndUpdate(
      {
        ...(registerAppDto._id ? { _id: registerAppDto._id } : { code: registerAppDto.code }),
        version: registerAppDto.version,
      },
      registerAppDto,
      { new: true },
    ).exec();
    if (!app) {
      const newApp: AppModel = await this.appModel.create(registerAppDto);
      await this.notifyAppChanged(newApp.toObject(), 'created');
    } else {
      await this.notifyAppChanged(app.toObject(), 'updated');
    }
  }

  public async setOrder(orderAppDto: OrderAppDto): Promise<void> {
    await this.appModel.findByIdAndUpdate(orderAppDto.microUuid, { order: orderAppDto.order }).exec();
  }

  private async migrateFromOldAPI(registerAppDto: RegisterAppDto): Promise<void> {
    const app: AppModel = await this.appModel.findOne(
      registerAppDto._id ? { _id: registerAppDto._id } : { code: registerAppDto.code },
    ).exec();
    if (!app) {
      registerAppDto.access = {
        business: { url: registerAppDto.url },
      };
    } else {
      registerAppDto.access = app.access;
      registerAppDto.access.business.url = registerAppDto.url;
    }
  }

  private async notifyAppChanged(app: object, eventType: 'created' | 'updated'): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: `app-registry.event.dashboard.application.${eventType}`,
        exchange: 'async_events',
      },
      {
        name: `app-registry.event.dashboard.application.${eventType}`,
        payload: {
          ...app,
        },
      },
    );
  }
}
