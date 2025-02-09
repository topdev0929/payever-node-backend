import { Controller, Get, HttpCode, HttpStatus, Logger, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RabbitMqClient } from '@pe/nest-kit/modules/rabbit-mq';

import { environment } from '../../environments';

@Controller('bus-test')
// @TODO uncomment
// @UseGuards(AuthGuard)
@ApiTags('bus-test')
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class TestController {
  private rabbitClient: RabbitMqClient;

  constructor(
    private readonly logger: Logger,
  ) {
    this.rabbitClient = new RabbitMqClient(environment.rabbitmq, this.logger);
  }

  @Get('business/:businessId/create/:currency')
  @HttpCode(HttpStatus.OK)
  public async createBusiness(
    @Param('businessId') businessId: string,
    @Param('currency') currency: string,
  ): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: 'users.event.business.created',
          exchange: 'async_events',
        },
        {
          name: 'users.event.business.created',
          payload: {
            _id: businessId,
            createdAt: Date.now(),
            currency: currency,
          },
        },
      );
  }

  @Get('business/:businessId/increase/:date/:amount')
  @HttpCode(HttpStatus.OK)
  public async enableSubscription(
    @Param('businessId') businessId: string,
    @Param('date') date: string,
    @Param('amount') amount: number,
  ): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: 'transactions.event.payment.paid',
          exchange: 'async_events',
        },
        {
          name: 'transactions.event.payment.paid',
          payload: {
            amount: amount,
            business: businessId,
            date: new Date(Date.parse(date)),
          },
        },
      );
  }

  @Get('business/:businessId/channel-set/:channelSetId/:type')
  @HttpCode(HttpStatus.OK)
  public async channelSetCreated(
    @Param('businessId') businessId: string,
    @Param('channelSetId') channelSetId: string,
    @Param('type') type: string,
  ): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: 'channels.event.channel-set.created',
          exchange: 'async_events',
        },
        {
          createdAt: '2018-02-23T08:33:54+00:00',
          name: 'channels.event.channel-set.created',
          payload: {
            business: {
              id: businessId,
            },
            channel: {
              type: type,
            },
            id: channelSetId,
          },
        },
      );
  }

  @Get('business/:businessId/campaign/:campaignId/:name/:contacts/channel-set/:channelSetId')
  @HttpCode(HttpStatus.OK)
  public async campaignCreated(
    @Param('businessId') businessId: string,
    @Param('channelSetId') channelSetId: string,
    @Param('campaignId') campaignId: string,
    @Param('name') name: string,
    @Param('contacts') contacts: number,
  ): Promise<void> {
    await this.rabbitClient
      .send(
        {
          channel: 'marketing.event.campaign-creation.done',
          exchange: 'async_events',
        },
        {
          name: 'marketing.event.campaign-creation.done',
          payload: {
            business: businessId,
            channelSet: channelSetId,
            contactsCount: contacts,
            id: campaignId,
            name: name,
          },
        },
      );
  }

  @Get('business/:businessId/payment/:paymentId/paid/:amount')
  @HttpCode(HttpStatus.OK)
  public async paid(
    @Param('businessId') businessId: string,
    @Param('paymentId') paymentId: string,
    @Param('amount') amount: number,
  ): Promise<{ }> {
    await this.rabbitClient.send(
      {
        channel: 'transactions.event.payment.add',
        exchange: 'async_events',
      },
      {
        name: 'transactions.event.payment.add',
        payload: {
          amount: amount,
          business: {
            id: businessId,
          },
          channel_set: {
            id: 'c2ca6ce2-13db-4200-8415-eb8b877358fc',
          },
          date: (new Date()).toISOString(),
          id: paymentId,
          items: [
            {
              _id: '5c3f1c8a05db0d0013468dcf',
              created_at: '2019-01-16T11:58:45.000+0000',
              identifier: '1160dc16-ef6e-4a85-b0c3-2f9097014fe5',
              name: 'DRONE 1',
              // identifier: uuid(),
              price: 900,
              price_net: 0,
              quantity: 1,
              thumbnail: 'https://payeverstaging.blob.core.windows.net'
                + '/products/33bd732f-31cf-430c-b2a2-12da31a8bc0a-ab24935c-d6ca-4d22-8788-96ac602ef075-Products4.png',
              updated_at: '2019-01-16T11:58:45.000+0000',
              uuid: '619f8ea4-2e7e-48b6-b51d-6735058af13c',
              vat_rate: 0,
            },
          ],
        },
      },
    );

    return { result: 'done' };
  }

  @Get('business/:businessId/payment/:paymentId/refund/:amount')
  @HttpCode(HttpStatus.OK)
  public async refund(
    @Param('paymentId') paymentId: string,
    @Param('amount') amount: number,
  ): Promise<{ }> {
    await this.rabbitClient
      .send(
      {
        channel: 'payever.event.payment.action.completed',
        exchange: 'async_events',
      },
      {
        action: 'refund',
        data: {
            amount: amount,
          },
        name: 'payever.event.payment.action.completed',
        payload: {
          payment: {
            address: {
              city: 'Hamburg',
              country: 'DE',
              first_name: 'Stub',
              last_name: 'Accepted',
              salutation: 'SALUTATION_MR',
              street: 'Am Strandkai',
              zip_code: '20457',
            },
            amount: 650,
            created_at: '2019-01-15T13:41:25+00:00',
            currency: 'EUR',
            customer_email: 'we9fhwiuhiu@gmail.com',
            customer_name: 'Stub Accepted',
            delivery_fee: 0,
            down_payment: 0,
            fee: 0,
            id: '9a8521e181fa3de1127141aa3653b622',
            payment_fee: 0,
            place: 'refunded',
            reference: '3b864596-ca5b-429b-bfc1-4f9d5d87c375',
            specific_status: 'ACCEPTED',
            status: 'STATUS_REFUNDED',
            total: 650,
            uuid: paymentId,
          },
        },
      },
    );

    return { result: 'done' };
  }

  @Get('business/:businessId/mailer-report-request')
  @HttpCode(HttpStatus.OK)
  public async requestData(
    @Param('businessId') businessId: string,
  ): Promise<{ }> {
    await this.rabbitClient
      .send(
      {
        channel: 'mailer-report.event.report-data.requested',
        exchange: 'async_events',
      },
      {
        name: 'mailer-report.event.report-data.requested',
        payload: {
          businessIds: [ businessId ],
        },
      },
    );

    return { result: 'done' };
  }
}
