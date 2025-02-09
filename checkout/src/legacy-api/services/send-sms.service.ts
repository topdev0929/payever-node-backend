import { ChannelSetService, ChannelSetModel } from '../../channel-set';
import { IntercomService } from '@pe/nest-kit';
import {
  forwardRef,
  Logger,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PreconditionFailedException,
} from '@nestjs/common';
import { ApiCallPaymentCreateDto } from '../dto';
import { environment } from '../../environments';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AxiosResponse } from 'axios';

@Injectable()
export class SendSmsService {
  constructor(
    @Inject(forwardRef(() => ChannelSetService))
    private readonly channelSetService: ChannelSetService,
    private readonly intercom: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async sendPaymentRedirectUrlSms(
    apiCallPayment: ApiCallPaymentCreateDto,
    redirectUrl: string,
    businessId: string,
    channelSetId: string,
  ): Promise<void> {
    const checkoutPhoneNumber: string = await this.getCheckoutPhoneNumber(channelSetId);
    if (!checkoutPhoneNumber) {
      throw new PreconditionFailedException('Checkout phone is not configured');
    }

    const message: string =
      apiCallPayment?.link_message?.content ? `${apiCallPayment.link_message.content}: ${redirectUrl}` : redirectUrl;

    await this.sendSms(
      businessId,
      checkoutPhoneNumber,
      apiCallPayment.phone,
      message,
    );
  }

  public async sendPayment2faPinSms(
    businessId: string,
    customerPhoneNumber: string,
    pin: number,
    channelSetId: string,
  ): Promise<void> {
    const checkoutPhoneNumber: string = await this.getCheckoutPhoneNumber(channelSetId);
    if (!checkoutPhoneNumber) {
      throw new PreconditionFailedException('Checkout phone is not configured');
    }

    await this.sendSms(
      businessId,
      checkoutPhoneNumber,
      customerPhoneNumber,
      `payever: Your payment verification code: ${pin}. This code cannot be shared.`,
    );
  }

  private async getCheckoutPhoneNumber(
    channelSetId: string,
  ): Promise<string> {
    const channelSet: ChannelSetModel =
      await this.channelSetService.findOneById(channelSetId);

    if (!channelSet) {
      return null;
    }

    await channelSet.populate('checkout').execPopulate();

    return channelSet.checkout?.settings?.phoneNumber;
  }

  private async sendSms(businessId: string, from: string, to: string, message: string): Promise<void> {
    const twilioUrl: string =
      environment.thirdPartyCommunicationsMicroUrl
      + `/business/${businessId}/integration/twilio/action/send-message`;

    const data: { } = {
      from: '+' + from,
      to: to,

      message: message,
    };
    const request: Observable<any> = await this.intercom.post(twilioUrl, data);

    await request.pipe(
      map((apiResponse: AxiosResponse<any>) => {
        return apiResponse.data;
      }),
      catchError((e: any) => {
        this.logger.error({
          error: e.message,
          errorResponse: e.response?.data,
          message: 'A problem sending a payment sms',
        });
        const errorText: string = e.response?.data || e.message;

        throw new HttpException(errorText, HttpStatus.PRECONDITION_FAILED);
      }),
    ).toPromise();
  }
}
