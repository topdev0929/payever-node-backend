import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from '../models';
import { Model } from 'mongoose';
import { BlogEventDto } from '../dto';
import { BlogSchemaName } from '../schemas';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(BlogSchemaName) private readonly blogModel: Model<BlogModel>,
  ) { }

  public async createOrUpdateBlogFromEvent(data: BlogEventDto): Promise<BlogModel> {
    const businessId: string = data.business ? data.business.id : null;

    return this.blogModel.findOneAndUpdate(
      { _id: data.id },
      {
        $set: {
          businessId,
          name: data.name,
          picture: data.picture,
        },
      },
      { new: true, upsert: true },
    );
  }

  public async deleteBlog(data: BlogEventDto): Promise<void> {
    await this.blogModel.deleteOne({ _id: data.id }).exec();
  }

  public async getDefaultBusinessBlog(businessId: string): Promise<BlogModel> {
    return this.blogModel.findOne({
      businessId,
      default: true,
    });
  }

  public async getAllBusinessBlogs(businessId: string): Promise<BlogModel[]> {
    return this.blogModel.find({
      businessId,
    });
  }
}
