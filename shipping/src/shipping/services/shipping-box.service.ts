import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingBoxSchemaName } from '../schemas';
import { CreateShippingBoxDto, UpdateShippingBoxDto } from '../dto';
import { ShippingBoxModel } from '../models/shipping-box.model';
import { ShippingBoxInterface } from '../interfaces';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class ShippingBoxService {
  constructor(
    @InjectModel(ShippingBoxSchemaName) private readonly shippingBoxModel: Model<ShippingBoxModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(dto: CreateShippingBoxDto): Promise<ShippingBoxModel> {
    const shippingBox: ShippingBoxModel = await this.shippingBoxModel.create({
      ...dto,
      businessId: dto.business,
    });

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, shippingBox);

    return shippingBox;

  }

  public async getBoxes(businessId: string): Promise<ShippingBoxModel[]> {
    return this.shippingBoxModel.find({ businessId: businessId });
  }

  public async getDefaultBoxes(): Promise<ShippingBoxModel[]> {
    return this.shippingBoxModel.find({ isDefault: true });
  }

  public async findOneById(id: string): Promise<ShippingBoxModel> {
    return this.shippingBoxModel.findById(id).exec();
  }

  public async findOneByIntegration(integrationId: string): Promise<ShippingBoxModel[]> {
    return this.shippingBoxModel.find({
      integration: integrationId,
    });
  }

  public async deleteOneById(id: string): Promise<ShippingBoxInterface> {
    const shippingBox: ShippingBoxModel = await this.shippingBoxModel.findOneAndDelete({ _id: id });

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, shippingBox._id);

    return shippingBox;
  }

  public async update(shippingBoxModel: ShippingBoxModel, dto: UpdateShippingBoxDto ): Promise<ShippingBoxModel> {
    const shippingBox: ShippingBoxModel = await this.shippingBoxModel.findOneAndUpdate(
      { _id: shippingBoxModel._id }, 
      { $set: dto as ShippingBoxModel },
    ).exec();

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, shippingBox);

    return shippingBox;
  }

  public async createOrUpdate(shippingBoxes: ShippingBoxInterface[], integrationId: string ): Promise<void> {
    const boxes: ShippingBoxModel[] = await this.findOneByIntegration(integrationId);
    for (const box of boxes) {
      const shippingBox: ShippingBoxModel = await this.shippingBoxModel.findByIdAndRemove(box.id).exec();
      await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, shippingBox._id);
    }
    for (const shippingBox of shippingBoxes) {
      const newShippingBox: ShippingBoxModel = await this.shippingBoxModel.create({
        ...shippingBox,
        integration: integrationId,
      } as ShippingBoxModel);

      await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, newShippingBox);
    }
  }
}
