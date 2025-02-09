import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BlogRabbitEnum } from '../enums';
import { BlogElasticService } from '../services';

@Controller()
export class ElasticConsumer {
  constructor(
    private readonly blogElasticService: BlogElasticService,
  ) { }

  @MessagePattern({
    name: BlogRabbitEnum.ElasticSingleIndex,
  })
  public async ElasticSingleIndex(payload: any): Promise<void> {
    await this.blogElasticService.saveIndexRBMQ(payload.data);
  }

  @MessagePattern({
    name: BlogRabbitEnum.ElasticDeleteByQuery,
  })
  public async ElasticDeleteByQuery(payload: any): Promise<void> {
    await this.blogElasticService.deleteIndexRBMQ(payload.query);
  }
}
