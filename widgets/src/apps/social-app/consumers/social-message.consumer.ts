import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitEventNameEnum } from '../enums';
import { SocialPostService } from '../services';

@Controller()
export class SocialMessageConsumer {
  constructor(
    private readonly PostService: SocialPostService,
  ) { }

  @MessagePattern({
    name: RabbitEventNameEnum.SocialPostCreated,
  })
  public async socialPostCreated(data: any): Promise<void> {
    await this.upsert(data);
  }

  @MessagePattern({
    name: RabbitEventNameEnum.SocialPostUpdated,
  })
  public async socialPostUpdated(data: any): Promise<void> {
    await this.upsert(data);
  }

  @MessagePattern({
    name: RabbitEventNameEnum.SocialPostExported,
  })
  public async socialPostExported(data: any): Promise<void> {
    await this.upsert(data);
  }

  @MessagePattern({
    name: RabbitEventNameEnum.SocialPostDeleted,
  })
  public async socialPostDeleted(data: any): Promise<void> {
    await this.PostService.remove(data.id || data._id);
  }

  private async upsert(data: any): Promise<void> {
    const Post: any = {
      _id: data.id || data._id,
      businessId: data.businessId,
      content: data.content,
      title: data.title,
      type: data.type,
    };
    await this.PostService.upsert(Post);
  }
}
