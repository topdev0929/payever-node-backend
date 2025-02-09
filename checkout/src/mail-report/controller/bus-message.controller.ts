import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { MailerReportEventDto } from '../dto/mailer-report-event.dto';
import {
  CombinedCheckoutStatInterface,
  CombinedPaymentOptionsInterface,
  PreparedCheckoutInterface,
} from '../interfaces';
import { BusMessageProducer } from '../producer';
import { CheckoutPaymentService } from '../services';

@Controller()
export class BusMessageController {
  constructor(
    private readonly checkoutPaymentService: CheckoutPaymentService,
    private readonly busMessageProducer: BusMessageProducer,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.MailReportDataRequested,
  })
  public async onMailerReportEvent(data: MailerReportEventDto): Promise<void> {
    this.logger.log('Received "mailer-report.event.report-data.requested" event');
    if (data.businessIds) {
      const tasks: Array<Promise<PreparedCheckoutInterface>> = data.businessIds.map(async (businessId: string) => {
        const posPaymentOptions: CombinedPaymentOptionsInterface[] =
          await this.checkoutPaymentService.combinePaymentOptions(businessId);
        const checkoutStat: CombinedCheckoutStatInterface =
          await this.checkoutPaymentService.combineCheckoutStat(businessId);

        return {
          business: businessId,
          checkoutStat,
          posPaymentOptions,
        };
      });

      let result: PreparedCheckoutInterface[];

      try {
        result = await Promise.all(tasks);
      } catch (error) {
        this.logger.error({
          message: '"mailer-report.event.report-data.requested" error during data query.',

          businessIds: JSON.stringify(data.businessIds),
          error: error.message,
        });

        result = data.businessIds.map((businessId: string) => ({
          business: businessId,
          checkoutStat: null,
          posPaymentOptions: null,
        }));
      }
      await this.busMessageProducer.produceCheckoutReportDataPreparedEvent(result);
    }
  }
}
