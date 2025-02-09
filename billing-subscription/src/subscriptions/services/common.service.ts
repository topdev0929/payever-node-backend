import { Injectable, NotFoundException } from '@nestjs/common';
import { AppWithAccessConfigDto } from '../dto';
import { AccessConfigModel, DomainModel, SubscriptionNetworkModel } from '../models';
import { AccessConfigService } from './access-config.service';
import { DomainService } from './domain.service';
import { SubscriptionNetworkService } from './subscription-network.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly domainService: DomainService,
    private readonly accessConfigService: AccessConfigService,
    private readonly subscriptionNetworkService: SubscriptionNetworkService,
  ) {
  }

  public async getAccessConfigByDomain(domain: string): Promise<AppWithAccessConfigDto>  {
    let accessConfig: AccessConfigModel = await this.accessConfigService.getByDomain(domain);
    if (!accessConfig) {
      const subscriptionDomain: DomainModel = await this.domainService.findByDomain(domain);

      if (!subscriptionDomain) {
        throw new NotFoundException('Subscription Network for domain is not found');
      }

      accessConfig = await this.accessConfigService.findOneByCondition( 
        { subscriptionNetwork: subscriptionDomain.subscriptionNetwork },
      );
    }

    if (!accessConfig.isLive) {
      throw new NotFoundException('Subscription Network is not live yet');
    }

    const subscriptionNetwork: SubscriptionNetworkModel = await this.subscriptionNetworkService
    .getById(accessConfig.subscriptionNetwork as string);
    await subscriptionNetwork.populate('business channelSet').execPopulate();

    const business: any = (accessConfig.subscriptionNetwork as SubscriptionNetworkModel).business as any;

    if (business) {
      business.defaultLanguage = business.defaultLanguage || 'en';
    }

    return {
      ...subscriptionNetwork.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }
}
