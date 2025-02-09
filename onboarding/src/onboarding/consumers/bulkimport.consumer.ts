import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RabbitMqClient } from '@pe/nest-kit';
import { TaskRmqMessageDto } from '../dto';
import { RabbitBinding } from '../enums';
import { TaskDocument } from '../schemas';
import { TaskExecutor, TaskService } from '../services';
import { RabbitChannel } from '../../environments';

@Controller()
export class ProcessBulkImportConsumer {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskExecutor: TaskExecutor,
  ) { }

  @MessagePattern({
    channel: RabbitChannel.OnboardingCreated,
    name: RabbitBinding.OnboardingProcessBulkImport,
  })
  public async onProcessBulkImportEvent(dto: TaskRmqMessageDto): Promise<void> {
    const tasks: TaskDocument[] = await this.taskService.findByBulkImport(dto._id);
    await this.taskExecutor.executeProcesses(tasks);
  }
}
