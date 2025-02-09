import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IntercomService, RabbitMqClient } from '@pe/nest-kit';
import { parse } from 'cookie';
import { Model } from 'mongoose';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../../checkout';
import { ConnectionModel } from '../../connection/models';
import { ConnectionService } from '../../connection/services';
import { environment } from '../../environments';
import { IntegrationName } from '../../integration';
import { SendToDeviceRequestDto } from '../dto';
import { FlowModel } from '../models';
import { CheckoutDbService, CheckoutIntegrationSubscriptionService } from '../../common/services';

@Injectable()
export class SendToDeviceService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly checkoutIntegrationService: CheckoutIntegrationSubscriptionService,
    private readonly checkoutDbService: CheckoutDbService,
    private readonly connectionService: ConnectionService,
    private readonly intercomService: IntercomService,
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendToDevice(
    flow: FlowModel,
    sendToDeviceRequestDto: SendToDeviceRequestDto,
  ): Promise<void> {
    const checkout: CheckoutModel = await this.checkoutDbService.findOneById(flow.checkoutId);
    if (!checkout) {
      throw new NotFoundException(`Checkout for flow "${flow.id}" not found`);
    }

    await this.sendEmail(sendToDeviceRequestDto);
    await this.sendSms(checkout, sendToDeviceRequestDto);
  }

  private async sendEmail(sendToDeviceRequestDto: SendToDeviceRequestDto): Promise<void> {
    if (!sendToDeviceRequestDto.email) {
      return;
    }

    await this.rabbitClient.send(
      {
        channel: 'payever.event.mailer.send',
        exchange: 'async_events',
      },
      {
        name: 'payever.event.mailer.send',
        payload: {
          html: sendToDeviceRequestDto.message,
          subject: sendToDeviceRequestDto.subject,
          to: sendToDeviceRequestDto.email,
        },
      },
    );
  }

  private async sendSms(checkout: CheckoutModel, sendToDeviceRequestDto: SendToDeviceRequestDto): Promise<void> {
    if (!sendToDeviceRequestDto.phoneTo || !sendToDeviceRequestDto.phoneFrom) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(checkout.businessId) as BusinessModel;
    const checkoutSubscriptions: CheckoutIntegrationSubModel[] =
      await this.checkoutIntegrationService.getEnabledSubscriptions(checkout, business);
    const communicationSub: CheckoutIntegrationSubModel = checkoutSubscriptions
      .find((x: CheckoutIntegrationSubModel) => x.integration.name === IntegrationName.Twilio);

    if (!communicationSub) {
      throw new HttpException(
        `Integration ${IntegrationName.Twilio} is not enabled for business ${business.id}`,
        HttpStatus.CONFLICT,
      );
    }

    const connections: ConnectionModel[] =
      await this.connectionService.findAllByBusinessAndIntegration(business, communicationSub.integration);
    if (!connections || !connections.length) {
      throw new HttpException(
        {
          message: 'Checkout has no configured communication integration.',

          business: business.id,
          checkout: checkout.id,
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const connection: ConnectionModel = connections.shift();
    const sendSmsUrl: string = `${environment.thirdPartyCommunicationsMicroUrl}`
      + `/business/${business.id}`
      + `/connection/${connection.id}`
      + `/action/send-message`
    ;
    const result: any = await this.intercomService.post<void>(
      `${sendSmsUrl}`,
      {
        from: sendToDeviceRequestDto.phoneFrom,
        message: sendToDeviceRequestDto.message,
        to: sendToDeviceRequestDto.phoneTo,
      },
    );

    await result.toPromise();
  }
}
