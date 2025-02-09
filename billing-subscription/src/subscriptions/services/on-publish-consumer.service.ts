import { Injectable } from '@nestjs/common';
import { DomainModel } from '../models/domain.model';
import { AccessConfigModel, SubscriptionNetworkModel } from '../models';
import { DomainService } from './domain.service';
import { CommonService } from './common.service';
import { environment } from '../../environments';
import { LogHelper } from '../../common/helpers';
import { AccessConfigService } from './access-config.service';
import { SubscriptionNetworkService } from './subscription-network.service';
import { AppWithAccessConfigDto } from '../dto';

@Injectable()
export class OnPublishConsumerService {
  constructor(
    private readonly subscriptionNetworksService: SubscriptionNetworkService,
    private readonly domainService: DomainService,
    private readonly commonService: CommonService,
    private readonly accessConfigService: AccessConfigService,
  ) {
  }

  public async publishData(
    subscriptionId: string,
    version: string,
    wsKey: string,
  ): Promise<any> {
    LogHelper.timeLog('publishData');
    let startTime: any;
    let endTime: any;

    startTime = new Date();
    const subscriptionNetwork: SubscriptionNetworkModel = 
    await this.subscriptionNetworksService.getById(subscriptionId);
    endTime = new Date();
    LogHelper.log('publishData findById', `${endTime - startTime}`);

    startTime = new Date();
    await this.accessConfigService.setLive(subscriptionNetwork._id);
    
    endTime = new Date();
    LogHelper.log('publishData setLive', `${endTime - startTime}`);

    startTime = new Date();
    const domains: DomainModel[] = await this.domainService.findByNetwork(subscriptionNetwork._id);
    endTime = new Date();
    LogHelper.log('publishData findBy', `${endTime - startTime}`);
    const domainNames: string[] = [];
    let accessConfig: AppWithAccessConfigDto;

    if (domains.length > 0 || domains[0]) {
      startTime = new Date();
      accessConfig = await this.commonService.getAccessConfigByDomain(domains[0].name);
      endTime = new Date();
      LogHelper.log('publishData getAccessConfigByDomain', `${endTime - startTime}`);
      for (const domain of domains) {
        domainNames.push(domain.name);
      }
    } else {
      startTime = new Date();
      const subscriptionAccessConfig: AccessConfigModel = await this.accessConfigService.findOneByCondition(
        {
          subscriptionNetwork: subscriptionId,
        },
      );
      endTime = new Date();
      LogHelper.log('publishData findOneByCondition', `${endTime - startTime}`);

      const accessDomain: string = subscriptionAccessConfig.ownDomain ? subscriptionAccessConfig.ownDomain
        : `${subscriptionAccessConfig.internalDomain}.${environment.subscriptionsDomain}`;

      domainNames.push(accessDomain);

      startTime = new Date();
      accessConfig = await this.commonService.getAccessConfigByDomain(accessDomain);
      endTime = new Date();
      LogHelper.log('publishData getAccessConfigByDomain', `${endTime - startTime}`);
    }

    if (accessConfig) {
      startTime = new Date();
      await this.accessConfigService.updateById(
        accessConfig.accessConfig._id,
        {
          version: version,
        },
      );
      accessConfig.accessConfig.version = version;
      endTime = new Date();
      LogHelper.log('publishData updateById n done', `${endTime - startTime}`);
    }

    return {
      accessConfig,
      domainNames,
    };
  }
}
