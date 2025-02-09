import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { BlogAccessConfigModel, BlogModel } from '../models';
import { BlogAccessConfigSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { UpdateAccessConfigDto } from '../dto';
import { environment } from '../../environments';
import slugify from 'slugify';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';
import { dispatchWrapperFactory } from '../producers';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class BlogAccessConfigService {
  private readonly dispatch: ReturnType<typeof dispatchWrapperFactory>;
  constructor(
    @InjectModel(BlogAccessConfigSchemaName)
      private readonly blogAccessConfigModel: Model<BlogAccessConfigModel>,
    dispatcher: EventDispatcher,
  ) {
    this.dispatch = dispatchWrapperFactory(dispatcher);
  }

  public async createOrUpdate(blog: BlogModel, dto: UpdateAccessConfigDto): Promise<BlogAccessConfigModel> {
    const currentAccessConfig: BlogAccessConfigModel = await this.findByBlog(blog);

    return !currentAccessConfig
      ? this.create(blog, dto)
      : this.update(currentAccessConfig, dto);
  }

  public async create(blog: BlogModel, dto: UpdateAccessConfigDto): Promise<BlogAccessConfigModel> {
    if (!dto.internalDomain) {
      dto = await this.generateInternalDomain(dto, blog.name);
    }

    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigModel.create({
      ...dto,
      blog: blog,
    } as BlogAccessConfigModel);

    await this.dispatch(
      KubernetesEventEnum.AppAccessCreated,
      accessConfig,
    );

    return accessConfig;
  }

  public async update(
    blogAccessConfig: BlogAccessConfigModel,
    dto: UpdateAccessConfigDto,
  ): Promise<BlogAccessConfigModel> {
    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigModel.findOneAndUpdate(
      { _id: blogAccessConfig.id },
      { $set: dto },
      { new: true },
    );

    await this.dispatch(
      KubernetesEventEnum.AppAccessUpdated,
      blogAccessConfig,
      accessConfig,
    );

    return accessConfig;
  }

  public async setLive(blog: BlogModel): Promise<void> {
    await this.blogAccessConfigModel.findOneAndUpdate(
      { blog: blog._id },
      {
        $set: {
          isLive: true,
        },
      },
    );
  }

  public async findOneByCondition(
    condition: FilterQuery<BlogAccessConfigModel>,
  ): Promise<BlogAccessConfigModel> {
    return this.blogAccessConfigModel.findOne(condition);
  }

  public async updateById(
    accessConfigId: string,
    dto: UpdateAccessConfigDto,
  ): Promise<BlogAccessConfigModel> {
    if (dto.internalDomain) {
      dto.internalDomain = this.cleanDomainName(dto.internalDomain);
    }
    if (dto.ownDomain) {
      dto.ownDomain = this.cleanDomainName(dto.ownDomain);
    }

    return this.blogAccessConfigModel.findByIdAndUpdate(
      accessConfigId,
      { $set: dto },
      { new: true },
    );
  }

  public async findById(id: string): Promise<BlogAccessConfigModel> {
    return this.blogAccessConfigModel.findOne({
      _id: id,
    });
  }

  public async findByBlog(blog: BlogModel): Promise<BlogAccessConfigModel> {
    return this.blogAccessConfigModel.findOne({
      blog: blog,
    });
  }

  public async deleteByBlog(blog: BlogModel): Promise<void> {
    const blogAccessConfig: BlogAccessConfigModel =  await this.blogAccessConfigModel.findOneAndDelete({
      blog: blog._id,
    });

    await this.dispatch(
      KubernetesEventEnum.AppAccessDeleted,
      blogAccessConfig,
    );
  }

  public async getByDomain(domain: string): Promise<BlogAccessConfigModel> {
    const blogsDomain: string = environment.blogsDomain;
    const oldDomain: string = blogsDomain.replace('new.', '');
    let condition: any;

    switch (true) {
      case blogsDomain && domain.endsWith(blogsDomain):
        condition = { internalDomain: domain.replace('.' + blogsDomain, '') };
        break;
      case oldDomain && domain.endsWith(oldDomain):
        condition = { internalDomain: domain.replace('.' + oldDomain, '') };
        break;
      default:
        condition = { ownDomain: domain };
        break;
    }

    return this.blogAccessConfigModel.findOne(condition)
    .populate('blog')
    .exec();
  }

  private async generateInternalDomain(
    dto: UpdateAccessConfigDto,
    blogName: string,
  ): Promise<UpdateAccessConfigDto> {
    const domain: string = slugify(blogName).toLowerCase();
    dto.internalDomainPattern = domain;
    dto.internalDomain = await this.isInternalDomainDuplicated(domain)
      ? await this.generateSuffixedDomain(domain)
      : domain
    ;

    return dto;
  }

  private async isInternalDomainOccupied(domain: string): Promise<boolean> {
    const config: BlogAccessConfigModel = await this.blogAccessConfigModel.findOne({
      internalDomain: domain,
    });

    return !!config;
  }

  private async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: BlogAccessConfigModel = await this.blogAccessConfigModel.findOne({
      internalDomainPattern: domain,
    });

    return !!config;
  }

  private async generateSuffixedDomain(domain: string): Promise<string> {
    const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
    const generated: string = domain + '-' + suffix;
    if (await this.isInternalDomainOccupied(generated)) {
      return this.generateSuffixedDomain(domain);
    }

    return generated;
  }

  private cleanDomainName(domain: string): string {
    domain = domain.replace(/[^a-zA-Z0-9-]/gm, '');
    domain = domain.replace(/-{2,}/gm, '-');
    domain = domain.replace(/^-/gm, '');
    domain = domain.replace(/(.*)-$/gm, `$1`);

    return domain;
  }
}
