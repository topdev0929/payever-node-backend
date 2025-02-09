import { PaymentsService } from './payments.service';
import { BusinessModel } from '../../business';
import {
  IntegrationModel,
  IntegrationSubscriptionService,
  IntegrationSubscriptionModel,
} from '../../integration';
import { createStubService } from '../../../test/create-stub-service';
import { SinonMock, mock } from 'sinon';
import { expect } from 'chai';
import { HttpService } from '@nestjs/common';
import { from } from 'rxjs';
import { RabbitMqClient } from '@pe/nest-kit';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;
  let rabbitmqClient: SinonMock;
  let subscriptionService: SinonMock;
  let httpService: SinonMock;

  beforeEach(() => {
    const rc = createStubService<RabbitMqClient>();
    const ss = createStubService<IntegrationSubscriptionService>();
    const hs = createStubService<HttpService>();
    rabbitmqClient = mock(rc);
    subscriptionService = mock(ss);
    httpService = mock(hs);
    paymentsService = new PaymentsService(rc, hs, ss);
  });

  it('getPayload', async () => {
    const bm: BusinessModel = {} as any;
    const im: IntegrationModel = {} as any;

    const sub = {
      payload: {
        name: 'name1',
        fileName: 'file1',
        type: 'type1',
        blobName: 'blob1',
      },
    };

    subscriptionService
      .expects('findOneByIntegrationAndBusiness')
      .withArgs(im, bm)
      .resolves(sub);

    const r = await paymentsService.getPayload(bm, im);
    expect(r).to.equal(sub.payload);

    subscriptionService.verify();
  });

  it('updatePayload', async () => {
    const bm: BusinessModel = {} as any;
    const im: IntegrationModel = {} as any;

    const sub = {
      payload: {
        name: 'name1',
        fileName: 'file1',
        type: 'type1',
        blobName: 'blob1',
      },
      save() {},
    };

    const subMock = mock(sub);

    subscriptionService
      .expects('findOneByIntegrationAndBusiness')
      .withArgs(im, bm)
      .resolves(sub);

    subMock.expects('save');

    const r = await paymentsService.updatePayload(bm, im, {});
    expect(r).to.equal(sub);

    subscriptionService.verify();
    subMock.verify();
  });

  it('sendApplicationSubmitEmailNotification', async () => {
    const im: IntegrationModel = {
      name: 'santander_installment',
    } as any;
    const sm: IntegrationSubscriptionModel = {
      payload: {},
    } as any;
    const bm: BusinessModel = {
      _id: 'befc23d1-a98a-45ed-99bf-01cf4ac1dce5',
    } as any;

    httpService.expects('get').returns(from(Promise.resolve({ data: {} })));

    const emailDTO = {
      business: {},
      cc: undefined,
      locale: 'en',
      template_name: 'santander_contract_files_uploaded',
      to: "service@payever.de",
      variables: { merchant: { email: '' } },
    };
    rabbitmqClient.expects('sendAsync').withArgs(
      {
        channel: 'payever.event.payment.email',
        exchange: 'async_events',
      },
      {
        name: 'payever.event.payment.email',
        payload: emailDTO,
      },
    );

    await paymentsService.sendApplicationSubmitEmailNotification(im, sm, bm, {
      headers: { authorization: 'auth' },
    });

    httpService.verify();
    rabbitmqClient.verify();
  });
});
