import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogAccessConfigService } from './blog-access-config.service';
import { DomainService } from './domain.service';
import { BlogWithAccessConfigResponseDto } from '../dto/domain-response.dto';
import { BlogService } from './blog.service';
import { PopulatorService } from './populator.service';
import { DomainModel } from '../models/domain.model';
import { Populable } from '../../dev-kit-extras/population';
import { BlogAccessConfigModel } from '../models/blog-access-config.model';
import { BlogModel } from '../models/blog.model';
import { CompiledThemeService, RedisService } from '@pe/builder-theme-kit/module/service';
import { BusinessService } from '@pe/business-kit';
import { RedisClient } from '@pe/nest-kit';

@Injectable()
export class CommonService {
  constructor(
    private readonly blogsService: BlogService,
    private readonly businessService: BusinessService,
    private readonly domainService: DomainService,
    private readonly blogAccessConfigService: BlogAccessConfigService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly populatorService: PopulatorService,
    private readonly redisClient: RedisClient,
  ) {
  }

  public async getAccessConfigByDomain(domain: string): Promise<BlogWithAccessConfigResponseDto>  {
    const accessConfig: BlogAccessConfigModel = await this.blogsService.getByDomain(domain);
    if (!accessConfig) {
      const blogDomain: Populable<DomainModel, {
        blog: { };
      }> = await this.domainService.findByDomain(domain);

      if (!blogDomain) {
        throw new NotFoundException('Blog for domain is not found');
      }

      const blogAccessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.findOneByCondition({
        blog: blogDomain.blog._id,
      });

      if (!blogAccessConfig.isLive) {
        return;
      }
      const populatedBlog1: Populable<BlogModel, {
        channelSet: { };
        business: { };
    }> = await this.populatorService.populateBlog(blogDomain.blog);

      return {
        ...populatedBlog1.toObject(),
        accessConfig: blogAccessConfig.toObject() as any,
      };
    }

    if (!accessConfig.isLive) {
      return;
    }

    const populatedAccessConfig: any =
    await this.populatorService.populateAccessConfig(accessConfig as any);

    const populatedBlog: Populable<BlogModel, {
      channelSet: { };
      business: { };
    }>  = await this.populatorService.populateBlog(populatedAccessConfig.blog);

    if (populatedBlog.business) {
      populatedBlog.business.defaultLanguage = populatedBlog.business.defaultLanguage || 'en';
    }

    return {
      ...populatedBlog.toObject(),
      accessConfig: accessConfig.toObject() as any,
    };
  }

  public async getBlogThemeByDomain(domain: string): Promise<any>  {
    let accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.getByDomain(domain);

    if (!accessConfig) {
      const blogDomain: any = await this.domainService.findByDomain(domain);

      if (!blogDomain) {
        throw new NotFoundException('Blog for domain is not found');
      }

      accessConfig = await this.blogAccessConfigService.findOneByCondition({
        blog: blogDomain.blog._id,
      });
    }

    const blogId: string = accessConfig.blog._id ? accessConfig.blog._id : accessConfig.blog as any;
    const blog: BlogModel = await this.blogsService.findOneById(blogId);
    const result: any = await this.compiledThemeService.getShopThemeByApplicationId(blogId);

    if (!await this.businessService.findOneById(blog.business as any)) {
      throw new NotFoundException(`domain business not found`);
    }

    return {
      ...result,
      businessId: blog.business,
    };
  }

  public async refreshThemeCache(
    applicationId: string,
    rebuild: boolean = false,
  ): Promise<void> {
    const accessConfig: BlogAccessConfigModel = await this.blogAccessConfigService.findOneByCondition(
      { blog: applicationId as any },
    );

    if (!accessConfig) {
      return ;
    }

    const domainName: string = process.env.BUILDER_BLOG_DOMAINS.replace('DOMAIN', accessConfig?.internalDomain);
    const redisKey: string = `blog:theme:by-domain:${domainName}`;

    await this.redisClient.getClient().del(redisKey);
    if (rebuild) {
      await this.getBlogThemeByDomain(domainName);
    }
  }
}
