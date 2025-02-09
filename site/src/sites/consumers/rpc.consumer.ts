import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SiteResponseDto } from '../dto';
import { RabbitChannelsEnum } from '../enums';
import { SitesRepository } from '../repositories';
import { SiteDocument } from '../schemas';
import { siteToResponseDto } from '../transformers';

@Controller()
export class RpcConsumer {
  constructor(
    private readonly sitesRepository: SitesRepository,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Rpc,
    name: 'site.rpc.readonly.find-by-id',
  })
  public async onGetSiteRequested(body: { _id: string }): Promise<SiteResponseDto> {
    const site: SiteDocument = await this.sitesRepository.findById(body._id);

    if (!site) { return null; }

    return siteToResponseDto(site);
  }
}
