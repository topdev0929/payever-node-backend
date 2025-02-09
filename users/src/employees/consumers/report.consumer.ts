import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum } from '../../user/enums';
import { RabbitMessagesEnum } from '../enum';
import { ReportService } from '../services';

@Controller()
export class ReportConsumer {
  constructor(
    private readonly reportService: ReportService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.GenerateReport,
  })
  public async onGenerateReport(payload: { reportId: string }): Promise<void> {
    await this.reportService.generateReport(payload.reportId);
  }
}
