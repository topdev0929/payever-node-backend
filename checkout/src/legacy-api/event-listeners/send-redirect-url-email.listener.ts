import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { LegacyApiEventEnum, ChannelSubTypeEnum } from '../enum';
import { ApiCallPaymentCreateDto } from '../dto';
import { SendEmailService } from '../services';

@Injectable()
export class SendRedirectUrlEmailListener {
  constructor(
    private readonly sendEmailService: SendEmailService,
  ) { }

  @EventListener(LegacyApiEventEnum.createPaymentRequested)
  public async handleSuccessPaymentCreateEmail(
    apiCallPaymentCreateDto: ApiCallPaymentCreateDto,
    redirectUrl: string,
    businessId: string,
  ): Promise<void> {
    if (apiCallPaymentCreateDto.channel_type === ChannelSubTypeEnum.Email && apiCallPaymentCreateDto.email) {
      await this.sendEmailService.sendPaymentRedirectUrlEmail(apiCallPaymentCreateDto, redirectUrl, businessId);
    }
  }
}
