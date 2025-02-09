import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { EventDispatcher } from '@pe/nest-kit';
import { TaskRmqMessageDto } from '../dto/task-rmq-message.dto';
import { RabbitBinding } from '../enums';
import { TaskDocument } from '../schemas';
import { TaskService } from '../services/task.service';
import { EventsGateway } from '../ws/events.gateway';
import { RabbitChannel } from '../../environments';

@Controller()
export class TaskProcessedConsumer {
  constructor(
    private readonly taskService: TaskService,
    private readonly dispatcher: EventDispatcher,
    private readonly eventsGateway: EventsGateway,
  ) { }

  @MessagePattern({
    channel: RabbitChannel.OnboardingProcessed,
    name: RabbitBinding.OnboardingTaskProcessed,
  })
  public async onTaskProcessedEvent(dto: TaskRmqMessageDto): Promise<void> {
    const task: TaskDocument = await this.taskService.findById(dto._id);

    await this.eventsGateway.send(task);
  }
}
