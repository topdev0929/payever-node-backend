import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel } from '../../business/models';
import { BusinessService } from '@pe/business-kit';
import { MailReportInterface } from '../interfaces';
import { TerminalModel } from '../models';
import { TerminalService } from '../services';
import { BusinessIdentifiersDto } from '../dto';
import { ReportDataEventProducer } from '../producers';

@Controller()
export class MailerReportMessageBusController {
  constructor(
    private businessService: BusinessService,
    private terminalService: TerminalService,
    private reportDataEventProducer: ReportDataEventProducer,
    private logger: Logger,
  ) { }

  @MessagePattern({
    name: 'mailer-report.event.report-data.requested',
  })
  public async onMailerReportEvent(data: BusinessIdentifiersDto): Promise<void> {
    if (!data.businessIds) {
      return;
    }

    const tasks: Array<Promise<MailReportInterface>> = [];

    for (const businessId of data.businessIds) {
      const task: Promise<MailReportInterface> = this.businessService
        .findOneById(businessId)
        .then((business: BusinessModel) => this.terminalService.getActive(business))
        .then((activeTerminal: TerminalModel) => ({ business: businessId, activeTerminal }));

      tasks.push(task);
    }

    let result: MailReportInterface[];

    try {
      result = await Promise.all(tasks);
    } catch (err) {
      this.logger.error({
        message: '"mailer-report.event.report-data.requested" error during data query.',

        businessIds: JSON.stringify(data.businessIds),
        error: err.message,
      });

      for (const businessId of data.businessIds) {
        result.push({
          activeTerminal: null,
          business: businessId,
        });
      }
    }
    await this.reportDataEventProducer.produceReportDataPrepared(result);
  }
}
