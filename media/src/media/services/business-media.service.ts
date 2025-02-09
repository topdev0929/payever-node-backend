import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, MediaItemModel } from '../models';
import { MediaItemService } from './media-item.service';
import { MediaServiceInterface } from '../interfaces';
import { StorageContainerEnum } from '../enum';

@Injectable()
export class BusinessMediaService implements MediaServiceInterface {

  constructor(
    @InjectModel('Business') private readonly businessModel: Model<BusinessModel>,
    private readonly mediaItemService: MediaItemService,
  ) { }

  public async create(contextId: string, container: string, name: string): Promise<void> {
    await this.mediaItemService.associateToBusiness(name, container, contextId);
  }

  public async remove(contextId: string, container: string, name: string): Promise<void> {
    await this.mediaItemService.disassociateFromBusiness(name, container, contextId);
    await this.mediaItemService.remove(name, container);
  }

  public async deleteMany(
    { container, name, businessIds }: { container: StorageContainerEnum; name: string; businessIds?: string[] },
  ): Promise<void> {
    await Promise.all(
      businessIds.map(
        (businessId: string) => this.mediaItemService.disassociateFromBusiness(name, container, businessId)),
    );
    await this.mediaItemService.remove(name, container);
  }

  public async findByName(
    contextId: string,
    container: string,
    name: string,
  ): Promise<MediaItemModel> {
    return this.mediaItemService.findOneForBusiness(
      name,
      container,
      contextId,
    );
  }
}
