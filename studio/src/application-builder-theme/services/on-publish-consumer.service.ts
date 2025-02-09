import { Injectable } from '@nestjs/common';
import { CommonService } from './common.service';
import { AppWithAccessConfigDto } from '../dto';
import { AccessConfigService } from './access-config.service';

@Injectable()
export class OnPublishConsumerService {
  constructor(
    private readonly commonService: CommonService,
    private readonly accessConfigService: AccessConfigService,
  ) {
  }

  public async publishData(
    applicationId: string,
    version: string,
  ): Promise<any> {
    const accessConfig: AppWithAccessConfigDto = await this.commonService.getAccessConfigByAppId(applicationId);

    if (accessConfig) {
      await this.accessConfigService.updateById(
        accessConfig.accessConfig._id,
        {
          version: version,
        },
      );
      accessConfig.accessConfig.version = version;
    }

    await this.accessConfigService.setLive(applicationId);

    return {
      accessConfig,
    };
  }
}
