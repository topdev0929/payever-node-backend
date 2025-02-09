import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BlogService } from '../services';
import { BlogRabbitMessagesEnum } from '../enums';
import { BlogEventDto } from '../dto';

@Controller()
export class BlogMessagesConsumer {
  constructor(
    private readonly blogService: BlogService,
  ) { }

  @MessagePattern({
    name: BlogRabbitMessagesEnum.blogCreated,
  })
  public async onBlogCreated(data: BlogEventDto): Promise<void> {
    await this.blogService.createOrUpdateBlogFromEvent(data);
  }

  @MessagePattern({
    name: BlogRabbitMessagesEnum.blogUpdated,
  })
  public async onBlogUpdated(data: BlogEventDto): Promise<void> {
    await this.blogService.createOrUpdateBlogFromEvent(data);
  }

  @MessagePattern({
    name: BlogRabbitMessagesEnum.blogExport,
  })
  public async onBlogExport(data: BlogEventDto): Promise<void> {
    await this.blogService.createOrUpdateBlogFromEvent(data);
  }

  @MessagePattern({
    name: BlogRabbitMessagesEnum.blogRemoved,
  })
  public async onTerminalDeleted(data: BlogEventDto): Promise<void> {
    await this.blogService.deleteBlog(data);
  }
}
