import { Controller, Logger } from '@nestjs/common';
import { BlogService } from '../services';
import { MessagePattern } from '@nestjs/microservices';
import { BlogModel } from '../models';

@Controller()
export class DeleteNonInternalBusinessConsumer {
  constructor(
    private readonly blogService: BlogService,
    private readonly logger: Logger,
  ) { }


  @MessagePattern({
    name: 'auth.event.non.internal.business.export',
  })
  /* tslint:disable-next-line:no-ignored-initial-value */
  public async nonInternalBusiness(data: any): Promise<void> {
    // todo: takedown, will be open occasionally when needed
    return ;
    if (
      process.env.KUBERNETES_INGRESS_NAMESPACE &&
      ['test', 'staging'].includes(process.env.KUBERNETES_INGRESS_NAMESPACE)
    ) {
      const blogs: BlogModel[] = await this.blogService.findByBusinessIds(data.businessIds);

      for (const blog of blogs) {
        this.logger.log(`Deleting data on shop ${blog._id}`);

        await this.blogService.removeInBusinessId(blog.business as any, blog, true);
      }
    }
    if (global.gc) { global.gc(); }
  }
}

