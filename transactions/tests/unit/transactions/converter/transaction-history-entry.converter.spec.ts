/* tslint:disable:no-big-function */
/* tslint:disable:object-literal-sort-keys */
/* tslint:disable:no-duplicate-string */
import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinonChai from 'sinon-chai';
import { TransactionHistoryEntryConverter } from '../../../../src/transactions/converter';
import { HistoryEventDataInterface } from '../../../../src/transactions/interfaces/history-event-message';
import { TransactionModel } from '../../../../src/transactions/models';
import { CheckoutTransactionHistoryItemInterface } from '../../../../src/transactions/interfaces/checkout';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect: Chai.ExpectStatic = chai.expect;

describe('TransactionHistoryEntryConverter', () => {
  const historyEventData: HistoryEventDataInterface = {
    amount: 12,
    delivery_fee: 0,
    payment_status: 'ACCEPTED',
    reason: 'reason_1',
    reference: 'test_ref',
    mail_event: {
      event_id: 'f01d7353-d56a-49af-b7cd-a1cead04fa44',
      template_name: 'template_name_1',
    },
  };

  const historyEventDataDifferent: HistoryEventDataInterface = {
    amount: 12,
    delivery_fee: 0,
    payment_status: 'ACCEPTED',
    reason: 'reason_1',
    mail_event: {
      event_id: 'f01d7353-d56a-49af-b7cd-a1cead04fa44',
      template_name: 'template_name_1',
    },
  };

  const transaction: TransactionModel = {
    items: [
      {
        id: '86b62cc1-cf75-4065-ac91-b1df6ccc6157',
        name: 'item_1',
        identifier: 'test_id',
      },
      {
        id: '86d6e5da-c5b2-41e6-b77f-0400cc17b9ab',
        name: 'item_2',
        identifier: 'test_id2',
      },
    ],
  } as TransactionModel;

  describe('fromHistoryActionCompleteMessage()', () => {
    it('should complete message from history action', () => {
      const type: string = 'type_1';
      const createdAt: Date = new Date('2009-11-04T18:55:41+00:00');

      expect(TransactionHistoryEntryConverter.fromHistoryActionCompletedMessage(
        transaction,
        type,
        createdAt,
        historyEventData,
      ))
        .to.deep.equal(
          {
            action: type,
            amount: 12,
            business_id: undefined,
            created_at: createdAt,
            currency: undefined,
            delivery_fee: 0,
            error: undefined,
            idempotency_key: undefined,
            is_external_api_call: undefined,
            items: undefined,
            payment_status: 'ACCEPTED',
            reason: 'reason_1',
            reference: 'test_ref',
            mail_event: {
              event_id: 'f01d7353-d56a-49af-b7cd-a1cead04fa44',
              template_name: 'template_name_1',
            },
            request_data: undefined,
            status: undefined,
            transaction_id: undefined,
          },
        );
    });

    it('should complete message from history action', () => {
      const type: string = 'type_1';
      const createdAt: Date = new Date('2009-11-04T18:55:41+00:00');
      const data: HistoryEventDataInterface = {
        amount: 12,
        delivery_fee: 0,
        payment_status: 'ACCEPTED',
        reason: 'reason_1',
        reference: 'test_ref',
      };
      expect(TransactionHistoryEntryConverter.fromHistoryActionCompletedMessage(
        transaction,
        type,
        createdAt,
        data,
      ))
        .to.deep.equal(
          {
            action: 'type_1',
            amount: 12,
            business_id: undefined,
            created_at: createdAt,
            currency: undefined,
            delivery_fee: 0,
            error: undefined,
            idempotency_key: undefined,
            is_external_api_call: undefined,
            items: undefined,
            payment_status: 'ACCEPTED',
            reason: 'reason_1',
            reference: 'test_ref',
            request_data: undefined,
            status: undefined,
            transaction_id: undefined,
          },
        );
    });
  });

  describe('fromCheckoutTransactionHistoryItem()', () => {
    it('should return transactionHistoryentry from checkoutTransactionHistory', () => {
      const type: string = 'type_1';
      const createdAt: Date = new Date('2009-11-04T18:55:41+00:00');
      const data: CheckoutTransactionHistoryItemInterface = {
        action: 'action_1',
        amount: 123,
        created_at: new Date().toISOString(),
        payment_status: 'REFUNDED',
        reason: 'reason_1',
        params: [],
      };
      expect(TransactionHistoryEntryConverter.fromCheckoutTransactionHistoryItem(
        type,
        createdAt,
        data,
      )).to.deep.equal(
        {
          action: type,
          amount: 123,
          created_at: createdAt,
          payment_status: 'REFUNDED',
          reason: 'reason_1',
          params: { },
        },
      );
    });

    it('should return transactionHistoryentry from checkoutTransactionHistory', () => {
      const type: string = 'type_1';
      const createdAt: Date = new Date('2009-11-04T18:55:41+00:00');
      const data: CheckoutTransactionHistoryItemInterface = {
        action: 'action_1',
        amount: 123,
        created_at: new Date().toISOString(),
        payment_status: 'REFUNDED',
        reason: 'reason_1',
        params: {
          value: 'val',
        },
      };
      expect(TransactionHistoryEntryConverter.fromCheckoutTransactionHistoryItem(
        type,
        createdAt,
        data,
      )).to.deep.equal(
        {
          action: type,
          amount: 123,
          created_at: createdAt,
          payment_status: 'REFUNDED',
          reason: 'reason_1',
          params: {
            value: 'val',
          },
        },
      );
    });

    it('should return transactionHistoryentry from checkoutTransactionHistory without params', () => {
      const type: string = 'type_1';
      const createdAt: Date = new Date('2009-11-04T18:55:41+00:00');
      const data: CheckoutTransactionHistoryItemInterface = {
        action: 'action_1',
        amount: 123,
        created_at: new Date().toISOString(),
        payment_status: 'REFUNDED',
        reason: 'reason_1',
      };
      expect(TransactionHistoryEntryConverter.fromCheckoutTransactionHistoryItem(
        type,
        createdAt,
        data,
      )).to.deep.equal(
        {
          action: type,
          amount: 123,
          created_at: createdAt,
          payment_status: 'REFUNDED',
          reason: 'reason_1',
        },
      );
    });
  });
});
