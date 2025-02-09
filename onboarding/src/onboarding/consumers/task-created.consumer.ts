import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RabbitMqClient } from '@pe/nest-kit';
import { TaskRmqMessageDto } from '../dto';
import { RabbitBinding } from '../enums';
import { TaskDocument } from '../schemas';
import { TaskExecutor, TaskService } from '../services';
import { RabbitChannel } from '../../environments';

@Controller()
export class TaskCreatedConsumer {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskExecutor: TaskExecutor,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  @MessagePattern({
    channel: RabbitChannel.OnboardingCreated,
    name: RabbitBinding.OnboardingTaskCreated,
  })
  public async onTaskCreatedEvent(dto: TaskRmqMessageDto): Promise<void> {
    const task: TaskDocument = await this.taskService.findById(dto._id);
    await this.taskExecutor.execute(task);

    const processed: TaskDocument = await this.taskService.findById(dto._id);
    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingTaskProcessed,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingTaskProcessed,
        payload: processed,
      },
    );
  }
}
