import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { LegacyApiEventEnum, ChannelSubTypeEnum } from '../enum';
import { ApiCallPaymentCreateDto } from '../dto';
import { SendSmsService } from '../services';

@Injectable()
export class SendRedirectUrlSmsListener {
  constructor(
    private readonly sendSmsService: SendSmsService,
  ) { }

  @EventListener(LegacyApiEventEnum.createPaymentRequested)
  public async handleSuccessPaymentCreateSms(
    apiCallPayment: ApiCallPaymentCreateDto,
    redirectUrl: string,
    businessId: string,
    channelSetId: string,
  ): Promise<void> {
    if (!(apiCallPayment.channel_type === ChannelSubTypeEnum.Sms && apiCallPayment.phone)) {
      return;
    }

    await this.sendSmsService.sendPaymentRedirectUrlSms(apiCallPayment, redirectUrl, businessId, channelSetId);
  }
}
