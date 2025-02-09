import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SitesRepository } from '../repositories';
import { SiteDocument } from '../schemas';
import { RabbitChannelsEnum } from '../enums';

@Controller()
export class DeleteNonInternalBusinessConsumer {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly logger: Logger,
  ) { }


  @MessagePattern({
    channel: RabbitChannelsEnum.Site,
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
      const sites: SiteDocument[] = await this.sitesRepository.findByBusinessIds(data.businessIds);

      for (const site of sites) {
        this.logger.log(`Deleting data on shop ${site._id}`);
        await this.sitesRepository.delete(site, true);
      }
    }
    if (global.gc) { global.gc(); }
  }
}

