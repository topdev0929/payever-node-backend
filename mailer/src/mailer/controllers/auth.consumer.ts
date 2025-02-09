// tslint:disable: no-identical-functions
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ApplicationAccessRequestEventEnum } from '../enum';
import { ApplicationAccessRequestDto } from '../dto';
import { SenderService } from '../services';
import { AuthMailTransformer } from '../transformers';
import { MailDto } from '../dto/nodemailer';

@Controller()
export class AuthConsumer {
  constructor(
    private readonly userMailTransformer: AuthMailTransformer,
    private readonly sendService: SenderService,
    private readonly logger: Logger,
  ) { }

  @MessagePattern({
    name: ApplicationAccessRequestEventEnum.created,
  })
  public async onApplicationAccessRequestCreated(customerEmailDto: ApplicationAccessRequestDto): Promise<void> {
    this.logger.log('received a customer create event');
    const mailDto: MailDto = await this.userMailTransformer.applicationAccessRequestToMailDto(
      'customer_registered',
      customerEmailDto,
    );
    await this.sendService.send(mailDto);
  }

  @MessagePattern({
    name: ApplicationAccessRequestEventEnum.approved,
  })
  public async onApplicationAccessRequestApproved(customerEmailDto: ApplicationAccessRequestDto): Promise<void> {
    this.logger.log('received a customer approved event');
    const mailDto: MailDto = await this.userMailTransformer.applicationAccessRequestToMailDto(
      'customer_approved',
      customerEmailDto,
    );
    await this.sendService.send(mailDto);
  }

  @MessagePattern({
    name: ApplicationAccessRequestEventEnum.denied,
  })
  public async onApplicationAccessRequestDenied(customerEmailDto: ApplicationAccessRequestDto): Promise<void> {
    this.logger.log('received a customer denied event');
    const mailDto: MailDto = await this.userMailTransformer.applicationAccessRequestToMailDto(
      'customer_denied',
      customerEmailDto,
    );
    await this.sendService.send(mailDto);
  }
}
