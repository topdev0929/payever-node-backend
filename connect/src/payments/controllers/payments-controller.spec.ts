import { PaymentsController } from './payments-controller';
import { createStubService } from '../../../test/create-stub-service';
import { PaymentsService } from '../services/payments.service';
import { SinonMock, mock } from 'sinon';
import { IntegrationService } from '../../integration/services/integration.service';
import { BusinessModel } from '../../business';
import { expect } from 'chai';
import { UpdatePaymentDocumentsPayloadDto } from '../dto/update.payment-payload.dto';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: SinonMock;
  let integrationService: SinonMock;

  beforeEach(() => {
    const ps = createStubService<PaymentsService>();
    const is = createStubService<IntegrationService>();
    paymentsService = mock(ps);
    integrationService = mock(is);
    paymentsController = new PaymentsController(ps, is);
  });

  it('findOne', async () => {
    integrationService
      .expects('findOneByName')
      .withArgs('integration1')
      .resolves({ _id: '64ece66c-d2d2-4d6f-8586-317f70ca0391' });

    const bm: BusinessModel = {
      _id: '3dd5ac18-03d8-4119-8147-afce33969488',
    } as any;

    paymentsService
      .expects('getPayload')
      .withArgs(bm, { _id: '64ece66c-d2d2-4d6f-8586-317f70ca0391' })
      .resolves('RESULT');

    const r = await paymentsController.findOne('integration1', bm);
    expect(r).to.equal('RESULT');

    integrationService.verify();
    paymentsService.verify();
  });

  it('updatePayload', async () => {
    integrationService
      .expects('findOneByName')
      .withArgs('integration1')
      .resolves({ _id: '89f5517a-a038-438e-b8c5-d6bf74fc04ac' });

    const bm: BusinessModel = {
      _id: '671ea060-3297-44a3-b7e5-0793ee81fe72',
    } as any;

    const body: UpdatePaymentDocumentsPayloadDto = { application_sent: true };

    paymentsService
      .expects('updatePayload')
      .withArgs(bm, { _id: '89f5517a-a038-438e-b8c5-d6bf74fc04ac' }, body)
      .resolves({ _id: 'ae99cf41-e889-4dda-9f48-15d0e78af81b' });

    paymentsService
      .expects('sendApplicationSubmitEmailNotification')
      .withArgs(
        { _id: '89f5517a-a038-438e-b8c5-d6bf74fc04ac' },
        { _id: 'ae99cf41-e889-4dda-9f48-15d0e78af81b' },
        bm,
        {},
      );

    await paymentsController.updatePayload('integration1', bm, body, {});

    integrationService.verify();
    paymentsService.verify();
  });
});
