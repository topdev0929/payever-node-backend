import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MediaItemModel, MediaModel, UserModel } from '../models';
import { MediaItemService } from './media-item.service';
import { MediaServiceInterface } from '../interfaces';

@Injectable()
export class UserMediaService implements MediaServiceInterface {

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserModel>,
    private readonly mediaItemService: MediaItemService,
  ) { }

  public async create(contextId: string, container: string, name: string): Promise<void> {
    let user: UserModel = await this.userModel.findById(contextId);
    if (!user) {
      user = await this.userModel.create({ _id: contextId } as UserModel);
    }
    await this.mediaItemService.associateToUser(name, container, user._id);
  }

  public async remove(contextId: string, container: string, name: string): Promise<void> {
    await this.userModel.findOneAndUpdate(
      { _id: contextId },
      { $pull: { mediaItems: { container, name }}},
    );
    await this.mediaItemService.remove(name, name);
  }

  public async findByName(contextId: string, container: string, name: string): Promise<MediaItemModel> {
    const user: UserModel = await this.userModel.findById(contextId);
    if (!user) {
      throw new NotFoundException();
    }

    return this.mediaItemService.findOneForUser(name, container, user._id);
  }
}
