import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { BusinessService } from '@pe/business-kit';
import { BusinessModelLocal } from '../../business';
import { ReportDataRequestTaskInterface } from '../interfaces';
import { IntegrationSubscriptionService } from '../services';
import { Randomizer } from '../tools/randomizer';
import { ReportDataRequestedDto } from '../dto';
import { EventProducer } from '../producer';
import { IntegrationSubscriptionModel } from '../models';
import { RabbitChannelEnum } from '../../environments';

@Controller()
export class IntegrationSubscriptionBusMessageController {
  constructor(
    private readonly eventProducer: EventProducer,
    private readonly logger: Logger,
    private readonly businessService: BusinessService<BusinessModelLocal>,
    private readonly subscriptionService: IntegrationSubscriptionService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: 'mailer-report.event.report-data.requested',
  })
  public async getIntegrationsListNotInstalledFilteredByCountry(data: ReportDataRequestedDto): Promise<void> {
    if (data.businessIds && data.businessIds.length) {
      const tasks: Array<Promise<ReportDataRequestTaskInterface>> = data.businessIds.map(async (businessId: string) => {
        const business: BusinessModelLocal = await this.businessService.findOneById(
          businessId,
        );
        let taskData: ReportDataRequestTaskInterface = { business: businessId, connectData: [] };
        if (!business) {
          return taskData;
        }

        const integrationsFilteredByCountry: IntegrationSubscriptionModel[] = Randomizer.shuffleArray(
          await this.subscriptionService.filterNotInstalledByCountry(business),
        );
        taskData = {
          business: businessId,
          connectData: integrationsFilteredByCountry,
        };

        return taskData;
      });

      let result: ReportDataRequestTaskInterface[] = [];

      try {
        result = await Promise.all(tasks);
      } catch (err) {
        this.logger.error({
          businessIds: JSON.stringify(data.businessIds),
          error: err.message,
          text: '"mailer-report.event.report-data.requested" error during data query.',
        });
      }

      await this.eventProducer.sendReportDataPreparedMessage(result);
    }
  }
}
