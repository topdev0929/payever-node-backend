import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createHmac } from 'crypto';

import { ActionDto, CreateAppDto, UpdateAppDto, AppStatusDto } from '../dto';
import { AppModel, CategoryModel } from '../models';
import { AppEventsProducer } from '../producers';
import { AppSchemaName, CategorySchemaName } from '../schemas';
import { AppStatusEnum } from '../enums';
import { AccessTokenPayload } from '@pe/nest-kit';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(AppSchemaName)
      private readonly appModel: Model<AppModel>,
    @InjectModel(CategorySchemaName)
      private readonly categoryModel: Model<CategoryModel>,
    private readonly appEventsProducer: AppEventsProducer,
  ) { }

  public async getAll(): Promise<AppModel[]> {
    return this.appModel.find({ });
  }

  public async getUserApps(user: AccessTokenPayload): Promise<AppModel[]> {
    return this.appModel.find({ owner: user.id });
  }

  public async findOne(appId: string): Promise<AppModel> {
    return this.appModel.findOne({ _id: appId });
  }

  public async create(dto: CreateAppDto, user: AccessTokenPayload): Promise<AppModel> {
    const category: CategoryModel = await this.categoryModel.findOne({ name: dto.category });
    if (
      category &&
      category.actionNames.length > 0
    ) {
      const dtoActionNames: string[] = dto.actions ? dto.actions.map((item: ActionDto) => item.name) : [];

      // tslint:disable-next-line: no-misleading-array-reverse
      if (dtoActionNames.sort().toString() !== category.actionNames.sort().toString()) {
        throw new BadRequestException('Please provide all required action names.');
      }
    }

    const apiKey: string = await this.generateApiKey(dto);

    const app: AppModel = await this.appModel.create({
      ...dto,
      apiKey,
      owner: user.id,
    });

    await this.appEventsProducer.appCreatedEvent(app);

    return app;
  }

  public async update(app: AppModel, dto: UpdateAppDto): Promise<AppModel> {
    const updatedApp: AppModel = await this.appModel.findOneAndUpdate(
      {
        _id: app._id,
      },
      {
        $set: dto,
      },
      {
        new: true,
      },
    );

    await this.appEventsProducer.appUpdatedEvent(updatedApp);

    return updatedApp;
  }

  public async remove(app: AppModel): Promise<void> {
    await this.appModel.findOneAndRemove(
      {
        _id: app._id,
      },
    );

    await this.appEventsProducer.appDeletedEvent(app);
  }

  public async requestReview(app: AppModel): Promise<AppModel> {
    if (!(app.status === AppStatusEnum.Draft || app.status === AppStatusEnum.Rejected)) {
      throw new BadRequestException('App can\'t be reviewed');
    }

    const updatedApp: AppModel = await this.appModel.findOneAndUpdate(
      {
        _id: app._id,
      },
      {
        $push: {
          history: {
            rejectionReason: app.rejectionReason,
            status: app.status,
          },
        },
        $set: {
          status: AppStatusEnum.InReview,
        },
      },
      {
        new: true,
      },
    );

    await this.appEventsProducer.appUpdatedEvent(updatedApp);

    return updatedApp;
  }

  public async changeStatus(app: AppModel, dto: AppStatusDto): Promise<AppModel> {
    if (app.status !== AppStatusEnum.InReview) {
      throw new BadRequestException('Please put app in review');
    }

    const updatedApp: AppModel = await this.appModel.findOneAndUpdate(
      {
        _id: app._id,
      },
      {
        $push: {
          history: {
            rejectionReason: app.rejectionReason,
            status: app.status,
          },
        },
        $set: {
          rejectionReason: dto.rejectionReason,
          status: dto.status,
        },
      },
      {
        new: true,
      },
    );

    await this.appEventsProducer.appUpdatedEvent(updatedApp);

    return updatedApp;
  }

  private async generateApiKey(dto: CreateAppDto): Promise<string> {
    return createHmac('sha256', dto.key)
      .update(dto.title + dto.key)
      .digest('hex');
  }
}
