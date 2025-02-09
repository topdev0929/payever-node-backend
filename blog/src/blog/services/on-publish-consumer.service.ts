import { Injectable } from '@nestjs/common';

import { DomainModel } from '../models/domain.model';
import { Populable } from '../../dev-kit-extras/population';
import { BlogAccessConfigService } from './blog-access-config.service';
import { BlogService } from './blog.service';
import { BlogAccessConfigModel, BlogModel } from '../models';
import { DomainService } from './domain.service';
import { CommonService } from './common.service';
import { BlogWithAccessConfigResponseDto } from '../dto/domain-response.dto';
import { LogHelper } from '../../common/helpers';
import { environment } from '../../environments';

@Injectable()
export class OnPublishConsumerService {
  constructor(
    private readonly blogService: BlogService,
    private readonly domainService: DomainService,
    private readonly commonService: CommonService,
    private readonly blogAccessConfigService: BlogAccessConfigService,
  ) { }

  public async publishBlogData(blogId: string, version: string, wsKey: string): Promise<any> {
    LogHelper.timeLog('publishBlogData');
    let startTime: any;
    let endTime: any;

    startTime = new Date();
    const blog: BlogModel = await this.blogService.findOneById(blogId);
    endTime = new Date();
    LogHelper.log('publishBlogData findById', `${endTime - startTime}`);

    startTime = new Date();
    await this.blogAccessConfigService.setLive(blog);
    endTime = new Date();
    LogHelper.log('publishBlogData setLive', `${endTime - startTime}`);

    startTime = new Date();
    const domains: Array<Populable<DomainModel>> = await this.domainService.findByBlog(blog as any);
    endTime = new Date();
    LogHelper.log('publishBlogData findByBlog', `${endTime - startTime}`);
    const domainNames: string[] = [];
    let accessConfig: BlogWithAccessConfigResponseDto;

    if (domains.length > 0 || domains[0]) {
      startTime = new Date();
      accessConfig = await this.commonService.getAccessConfigByDomain(domains[0].name);
      endTime = new Date();
      LogHelper.log('publishBlogData getAccessConfigByDomain', `${endTime - startTime}`);
      for (const domain of domains) {
        domainNames.push(domain.name);
      }
    } else {
      startTime = new Date();
      const blogAccessConfig: BlogAccessConfigModel =
      await this.blogAccessConfigService.findByBlog(blog);
      endTime = new Date();
      LogHelper.log('publishBlogData findOneByCondition', `${endTime - startTime}`);

      const accessDomain: string = blogAccessConfig.ownDomain ? blogAccessConfig.ownDomain
        : `${blogAccessConfig.internalDomain}.${environment.blogsDomain}`;

      domainNames.push(accessDomain);

      startTime = new Date();
      accessConfig = await this.commonService.getAccessConfigByDomain(accessDomain);

      endTime = new Date();
      LogHelper.log('publishBlogData getAccessConfigByDomain', `${endTime - startTime}`);
    }

    if (accessConfig) {
      startTime = new Date();
      await this.blogAccessConfigService.updateById(
        accessConfig.accessConfig._id,
        {
          version: version,
        },
      );
      accessConfig.accessConfig.version = version;
      endTime = new Date();
      LogHelper.log('publishBlogData updateById n done', `${endTime - startTime}`);
    }

    return {
      accessConfig,
      domainNames,
    };
  }
}
