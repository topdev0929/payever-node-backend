import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding } from '../../../environments';
import { ClientThemePublishedDto, ProcessScheduleThemeDto } from '../dto';
import { EmailService } from '../services';

@Controller()
export class ProcessScheduleMessagesConsumer {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    name: 'client-mail.event.theme.published',
  })
  public async onClientThemePublishConsumer(dto: ClientThemePublishedDto): Promise<void> {
    try {
      await this.emailService.sendFromThemeId(dto.builderThemeId);
    } catch (e) {
      this.logger.log(e);
    }
  }
}

