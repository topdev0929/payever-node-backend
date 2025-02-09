import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';


import { EmailResultTypeEnum, RabbitChannelsEnum } from '../../message/enums';
import { MailMessageService } from '../../message';


enum MarketingRabbitMessagesEnum {
  FetchEmail = 'marketing.event.email.fetched',
}

@Controller()
export class MarketingConsumer {
  constructor(
    private mailMessageService: MailMessageService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: MarketingRabbitMessagesEnum.FetchEmail,
  })
  public async email(
    dto: any,
  ): Promise<void> {
    
    if (dto.type === EmailResultTypeEnum.NEW) {
      await this.mailMessageService.fetchedEmail(dto);
    } else if (dto.type === EmailResultTypeEnum.RES) {
      await this.mailMessageService.resSentEmail(dto);
    }
    
  }
}
