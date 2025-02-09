import { Injectable } from '@nestjs/common';
import { EventListener, RedisClient } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BlogService, DomainService } from '../services';
import { BusinessModel } from '../../business';
import { BlogModel } from '../models';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { CompiledThemeModel } from '@pe/builder-theme-kit';
import { BlogRabbitEventsProducer } from '../producers';

@Injectable()
export class BusinessListener {
  constructor(
    private readonly blogService: BlogService,
    private readonly redisClient: RedisClient,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly domainService: DomainService,
    private readonly blogRabbitEventsProducer: BlogRabbitEventsProducer,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void> {
    await this.blogService.create(business, { name: business.name }, true);
  }

  @EventListener(BusinessEventsEnum.BusinessExport)
  public async onBusinessExport(business: BusinessModel): Promise<void> {
    const blogs: BlogModel[] = await this.blogService.findAllByBusiness(business);
    if (blogs.length === 0) {
      await this.blogService.create(business, { name: business.name }, true);
    } else if (blogs.length === 1) {
      // first shop should be installed automatically, this is fix to rbmq
      const compiledTheme: CompiledThemeModel = await this.compiledThemeService.findByApplicationId(blogs[0]._id);
      if (!compiledTheme) {
        const domain: string = await this.domainService.getDomain(blogs[0]);
        await this.blogRabbitEventsProducer.produceBlogExportEvent(blogs[0], domain);
      }
    }
  }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async onBusinessRemoved(business: BusinessModel): Promise<void> {
    for (const blogId of business.blogs) {
      await this.blogService.removeById(blogId as any);
    }
    this.redisClient.del(`builder|business|${business._id}|application|blog|list`).catch();
  }
}
