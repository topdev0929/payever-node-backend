import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IntercomService } from '@pe/nest-kit';
import { AxiosResponse } from 'axios';
import { validate, ValidationError } from 'class-validator';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaymentDto } from '../dto';
import { environment } from '../environments';
import { ApplicationModel, CheckoutInterface, PaymentCode } from '../interfaces';
import { ApplicationSchemaName } from '../schemas';
import { PaymentUrlGenerator } from './payment-url.generator';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectModel(ApplicationSchemaName) private readonly applicationModel: Model<ApplicationModel>,
    private readonly intercom: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async sendCode(
    businessId: string,
    dto: PaymentDto,
    paymentCode: PaymentCode,
  ): Promise<void> {
    const errors: ValidationError[] = await validate(dto);

    if (errors && errors.length) {
      throw new BadRequestException(errors);
    }

    const checkout: CheckoutInterface = (await this.getApplication(businessId, dto)).checkout as CheckoutInterface;
    await this.sendSms(businessId, String(checkout.phoneNumber), dto.phone_number, String(paymentCode.code));
  }

  public async sendPayment(
    businessId: string,
    dto: PaymentDto,
    paymentCode: PaymentCode,
  ): Promise<void> {
    const application: ApplicationModel = await this.getApplication(businessId, dto);
    const url: string = PaymentUrlGenerator.generateRestoreFromCodeUrl(paymentCode._id);
    const message: string = CommunicationsService.generateMessage(application, url);
    const checkout: CheckoutInterface = application.checkout as CheckoutInterface;

    await this.sendSms(businessId, String(checkout.phoneNumber), dto.phone_number, message);
  }

  public static generateMessage(application: ApplicationModel, url: string): string {
    if (!application.checkout) {
      throw new BadRequestException('Application is not configured. Please configure checkout.');
    }

    if (!(application.checkout as CheckoutInterface).message) {
      return 'Application is not configured. Please specify message.';
    }

    return (application.checkout as CheckoutInterface).message
      .replace(/{{ ?application_url ?}}/gmi, url)
      .replace(/{{ ?shop_name ?}}/gmi, application.name)
    ;
  }

  private async sendSms(businessId: string, from: string, to: string, message: string): Promise<void> {
    const twilioUrl: string =
      environment.thirdPartyCommunicationsUrl
      + `/api/business/${businessId}/integration/twilio/action/send-message`;

    const data: { } = {
      from: '+' + from,
      to: to,

      message: message,
    };
    this.logger.log(`Terminal sending url called: ${twilioUrl}`);

    const request: Observable<AxiosResponse<any>> = await this.intercom.post(twilioUrl, data);

    await request.pipe(
      map((apiResponse: AxiosResponse<any>) => {
        return apiResponse.data;
      }),
      catchError((e: any) => {
        this.logger.error({
          error: e.response,
          message: 'A problem sending a payment sms',
        });
        throw new HttpException(e.response.data, e.response.status);
      }),
    ).toPromise();
  }

  private async getApplication(businessId: string, dto: PaymentDto): Promise<ApplicationModel> {
    const applicationId: string = dto.application_id || dto.terminal_id;
    if (applicationId) {
      const application: ApplicationModel = await this.applicationModel
        .findOne({ applicationId })
        .populate('checkout').exec()
      ;

      if (application.businessId !== businessId) {
        throw new BadRequestException(
          `Application id ${applicationId} does not match to business id ${businessId}`,
        );
      }

      return application;
    }

    return this.applicationModel
      .findOne({ businessId: businessId })
      .populate('checkout')
    ;
  }
}
