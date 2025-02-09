import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../enums';
import { RabbitMessagesEnum } from '../../common/enums';
import { SiteElasticService } from '../services';

@Controller()
export class ElasticConsumer {
  constructor(
    private readonly siteElasticService: SiteElasticService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Site,
    name: RabbitMessagesEnum.ElasticSingleIndex,
  })
  public async ElasticSingleIndex(payload: any): Promise<void> {
    await this.siteElasticService.saveIndexRBMQ(payload.data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Site,
    name: RabbitMessagesEnum.ElasticDeleteByQuery,
  })
  public async ElasticDeleteByQuery(payload: any): Promise<void> {
    await this.siteElasticService.deleteIndexRBMQ(payload.query);
  }
}
