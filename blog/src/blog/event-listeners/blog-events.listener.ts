import { Inject, Injectable } from '@nestjs/common';
import { CHANNEL_SET_SERVICE, ChannelSetServiceInterface } from '@pe/channels-sdk';
import { EventListener, RedisClient } from '@pe/nest-kit';
import { BlogEventsEnum } from '../enums';
import { BlogModel } from '../models';
import { BlogAccessConfigService, BlogElasticService, BlogService, DomainService } from '../services';
import { CompiledThemeModel } from '@pe/builder-theme-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';

@Injectable()
export class BlogEventsListener {
  constructor(
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
    private readonly blogService: BlogService,
    private readonly blogElasticService: BlogElasticService,
    private readonly blogAccessConfigService: BlogAccessConfigService,
    private readonly domainService: DomainService,
    private readonly redisClient: RedisClient,
    private readonly compiledThemeService: CompiledThemeService,
  ) { }

  @EventListener(BlogEventsEnum.BlogCreated)
  public async onBlogCreated(blog: BlogModel): Promise<void> {
    this.blogElasticService.saveIndex(blog).catch();
    await blog.populate('business').execPopulate();
    this.redisClient.del(`builder|business|${blog.business?._id}|application|blog|list`).catch();
  }

  @EventListener(BlogEventsEnum.BlogUpdated)
  public async onBlogUpdated(_originalBlog: BlogModel, updatedBlog: BlogModel): Promise<void> {
    this.blogElasticService.saveIndex(updatedBlog).catch();
    await updatedBlog.populate('business').execPopulate();
    this.redisClient.del(`builder|business|${updatedBlog.business?._id}|application|blog|list`).catch();
  }

  @EventListener(BlogEventsEnum.BlogRemoved)
  public async onBlogRemoved(blog: BlogModel, deleteTestData: boolean = false): Promise<void> {
    if (blog.channelSet && !deleteTestData) {
      await this.channelSetService.deleteOneById(blog.channelSet.id);
    }

    await this.blogAccessConfigService.deleteByBlog(blog);
    await this.domainService.deleteByBlog(blog);

    await this.compiledThemeService.findByApplicationId(blog._id);
    await this.compiledThemeService.removeByApplicationId(blog._id);

    this.blogElasticService.deleteIndex(blog).catch();

    await blog.populate('business').execPopulate();
    this.redisClient.del(`builder|business|${blog.business?._id}|application|blog|list`).catch();
  }
}
