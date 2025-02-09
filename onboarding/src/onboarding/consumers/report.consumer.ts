import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RabbitBinding } from '../enums';
import { RabbitChannel } from '../../environments';
import { ReportRmqMessageDto } from '../dto/report/report-rmq-message.dto';
import { ReportExecutor, ReportDetailService, TaskService, ReportService } from '../services';
import { ReportDetailDocument, ReportDocument, TaskDocument } from '../schemas';

@Controller()
export class ReportConsumer {
  constructor(
    private readonly reportExecutor: ReportExecutor,
    private readonly taskService: TaskService,
    private readonly reportDetailService: ReportDetailService,
    private readonly reportService: ReportService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    channel: RabbitChannel.OnboardingCreated,
    name: RabbitBinding.OnboardingGenerateTaskReport,
  })
  public async onTaskGenerateTaskReport(dto: ReportRmqMessageDto): Promise<void> {
    this.logger.log(`Generating Report: ${JSON.stringify(dto)}`);
    const reportDetail: ReportDetailDocument = await this.reportDetailService.findById(dto.reportDetailId);
    const task: TaskDocument = await this.taskService.findById(reportDetail.task);

    await this.reportExecutor.execute(task, reportDetail);
  }
}
