import { BadRequestException, Injectable, Logger, PreconditionFailedException } from '@nestjs/common';
import { TransactionPaymentDetailsConverter } from '../converter';
import { ActionPayloadDto } from '../dto/action-payload';
import {
  AllowedUpdateStatusPaymentMethodsEnum,
  PaymentStatusesEnum,
  HistoryApiCallStatusEnum,
} from '../enum';
import { TransactionUnpackedDetailsInterface } from '../interfaces';
import { TransactionModel } from '../models';
import { DtoValidationService } from './dto-validation.service';
import { ThirdPartyCallerService } from './third-party-caller.service';
import { TransactionsExampleService } from './transactions-example.service';
import { TransactionsService } from './transactions.service';
import { EventDispatcher } from '@pe/nest-kit';
import { PaymentActionEventEnum } from '../enum/events';
import * as _ from 'lodash';
import { ActionWrapperDto } from '../dto/helpers';
import { TransactionHistoryService } from './transaction-history.service';

@Injectable()
export class TransactionActionService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionHistoryService: TransactionHistoryService,
    private readonly dtoValidation: DtoValidationService,
    private readonly thirdPartyCallerService: ThirdPartyCallerService,
    private readonly exampleService: TransactionsExampleService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async doAction(
    transaction: TransactionModel,
    actionWrapper: ActionWrapperDto,
    skipValidation: boolean = false,
  ): Promise<TransactionUnpackedDetailsInterface> {
    actionWrapper.executionStartTime = process.hrtime();

    const actionPayload: ActionPayloadDto = actionWrapper.payloadDto;
    this.dtoValidation.checkFileUploadDto(actionPayload);
    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    const oldStatus: string = transaction.status;
    let thirdPartyActionResult: any = null;
    try {
      await this.eventDispatcher.dispatch(
        PaymentActionEventEnum.PaymentActionBefore,
        transaction,
        actionWrapper,
        skipValidation,
      );

      thirdPartyActionResult =
        await this.thirdPartyCallerService.runAction(unpackedTransaction, actionWrapper);

      actionWrapper.executionEndTime = process.hrtime(actionWrapper.executionStartTime);
      actionWrapper.executionTime =
        `${actionWrapper.executionEndTime[0]}s ${actionWrapper.executionEndTime[1] / 1000000}ms`;
      actionWrapper.status = HistoryApiCallStatusEnum.success;
    } catch (e) {
      const errorMessage: string =
        (typeof e.response?.data?.message === 'string')
          ? e.response.data.message
          : (e.response?.data?.error || e.message);

      this.logger.log(
        {
          action: actionWrapper.action,
          context: 'TransactionActionService',
          error: errorMessage,
          message: `Error occurred during running action`,
          transactionId: transaction.uuid,
        },
      );

      actionWrapper.executionEndTime = process.hrtime(actionWrapper.executionStartTime);
      actionWrapper.executionTime =
        `${actionWrapper.executionEndTime[0]}s ${actionWrapper.executionEndTime[1] / 1000000}ms`;
      actionWrapper.error = errorMessage;
      actionWrapper.status = HistoryApiCallStatusEnum.failed;

      await this.eventDispatcher.dispatch(
        PaymentActionEventEnum.PaymentActionFailed,
        transaction,
        actionWrapper,
      );

      throw new PreconditionFailedException(errorMessage);
    }

    transaction = await this.transactionsService.findModelByUuid(unpackedTransaction.uuid);

    await this.eventDispatcher.dispatch(
      PaymentActionEventEnum.PaymentActionAfter,
      transaction,
      actionWrapper,
      thirdPartyActionResult?.isIdempotentReplayed,
    );

    if (transaction.status !== oldStatus) {
      await this.eventDispatcher.dispatch(
        PaymentActionEventEnum.PaymentActionStatusChanged,
        transaction,
        transaction.status,
      );
    }

    await this.transactionHistoryService.prepareTransactionHistory(transaction);
    const updatedTransaction: TransactionUnpackedDetailsInterface =
      TransactionPaymentDetailsConverter.convert(transaction.toObject({ virtuals: true }));

    if (thirdPartyActionResult?.paymentDetails) {
      updatedTransaction.payment_details =
        _.mapKeys(thirdPartyActionResult.paymentDetails, (v: any, k: string) => _.snakeCase(k));
    }

    return updatedTransaction;
  }

  public async updateStatus(
    transaction: TransactionModel,
  ): Promise<TransactionUnpackedDetailsInterface> {
    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    const disabledUpdateStatuses: string[] = [
      PaymentStatusesEnum.Paid,
    ];

    if (!Object.values(AllowedUpdateStatusPaymentMethodsEnum).includes(
      unpackedTransaction.type as AllowedUpdateStatusPaymentMethodsEnum,
    )
      || disabledUpdateStatuses.includes(unpackedTransaction.status)
    ) {
      return unpackedTransaction;
    }

    const oldStatus: string = unpackedTransaction.status;

    try {
      await this.thirdPartyCallerService.updateStatus(unpackedTransaction);
    } catch (e) {
      this.logger.error(
        {
          context: 'TransactionActionService',
          error: e.message,
          message: `Error occurred during status update`,
          paymentId: unpackedTransaction.original_id,
          paymentUuid: unpackedTransaction.id,
        },
      );
      throw new BadRequestException(`Error occurred during status update. Please try again later. ${e.message}`);
    }

    let updatedTransaction: TransactionUnpackedDetailsInterface =
      await this.transactionsService.findUnpackedByUuid(transaction.uuid);

    const newStatus: string = updatedTransaction.status;

    if (newStatus !== oldStatus) {
      await this.eventDispatcher.dispatch(
        PaymentActionEventEnum.PaymentActionStatusChanged,
        transaction,
        newStatus,
      );
      updatedTransaction = await this.transactionsService.findUnpackedByUuid(unpackedTransaction.uuid);
    }

    await this.transactionHistoryService.prepareTransactionHistory(updatedTransaction as TransactionModel);

    return updatedTransaction;
  }

  public async doFakeAction(
    transaction: TransactionModel,
    actionPayload: ActionPayloadDto,
    action: string,
  ): Promise<TransactionUnpackedDetailsInterface> {
    switch (action) {
      case 'shipping_goods':
        transaction.status = 'STATUS_PAID';
        transaction.place = 'paid';
        transaction.shipping_order_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
        if (
          transaction.billing_address.id === 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ||
          transaction.billing_address.id === 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' ||
          transaction.billing_address.id === 'cccccccc-cccc-cccc-cccc-cccccccccccc'
        ) {
          transaction.example_shipping_label =
            `/api/business/${transaction.business_uuid}/${transaction.uuid}/`
            + `label/${transaction.billing_address.id}.pdf`;
          transaction.example_shipping_slip =
            `/api/business/${transaction.business_uuid}/${transaction.uuid}/`
            + `slip/${transaction.billing_address.id}.json`;

        }

        break;
      case 'refund':
        transaction.status = 'STATUS_REFUNDED';
        transaction.place = 'refunded';
        await this.exampleService.refundExample(transaction, actionPayload.fields.payment_return.amount);

        break;
      case 'cancel':
        transaction.status = 'STATUS_CANCELLED';
        transaction.place = 'cancelled';

        break;
      default:
    }

    await transaction.save();

    return this.transactionsService.findUnpackedByUuid(transaction.uuid);
  }
}
