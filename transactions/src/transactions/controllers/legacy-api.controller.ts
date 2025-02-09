import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum } from '@pe/nest-kit';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit/modules/auth';
import { TransactionConverter, TransactionPaymentDetailsConverter } from '../converter';
import { TransactionUnpackedDetailsInterface } from '../interfaces/transaction';
import { CheckoutTransactionInterface, CheckoutTransactionWithActionsInterface } from '../interfaces/checkout';
import { ActionItemInterface } from '../interfaces';
import { TransactionModel } from '../models';
import { ActionsRetriever, TransactionsService, TransactionHistoryService } from '../services';
import { OauthService } from '../../common/services';
import { PaymentActionsEnum, RefundCaptureTypeEnum } from '../enum';

@Controller('legacy-api')
@ApiTags('legacy-api')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })

export class LegacyApiController {

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly actionsRetriever: ActionsRetriever,
    private readonly oauthService: OauthService,
    private readonly transactionHistoryService: TransactionHistoryService,
  ) { }

  @Get('transactions/:original_id')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @Acl({ microservice: 'transactions', action: AclActionsEnum.read })
  public async getTransactionById(
    @Param('original_id') transactionId: string,
    @User() user: AccessTokenPayload,
  ): Promise<CheckoutTransactionWithActionsInterface> {
    const transaction: TransactionModel = await this.transactionsService.findModelByParams({
      original_id: transactionId,
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction by id ${transactionId} not found`);
    }

    const businessId: string = this.oauthService.getOauthUserBusiness(user, transaction.business_uuid);

    if (transaction.business_uuid !== businessId) {
      throw new ForbiddenException(`You're not allowed to get transaction with id ${transactionId}`);
    }

    await this.transactionHistoryService.prepareTransactionHistory(transaction);

    const unpackedTransaction: TransactionUnpackedDetailsInterface = TransactionPaymentDetailsConverter.convert(
      transaction.toObject({ virtuals: true }),
    );

    const checkoutTransaction: CheckoutTransactionInterface = TransactionConverter.toCheckoutTransaction(
      unpackedTransaction,
    );
    const actions: ActionItemInterface[] = !transaction.example
      ? await this.actionsRetriever.retrieve(unpackedTransaction)
      : this.actionsRetriever.retrieveFakeActions(unpackedTransaction);

    checkoutTransaction.amount_capture_rest =
      actions.find(
        (actionItem: ActionItemInterface) => actionItem.action === PaymentActionsEnum.ShippingGoods,
      )?.refundCaptureType === RefundCaptureTypeEnum.real
        ? unpackedTransaction.amount_capture_rest_with_partial_cancel
        : unpackedTransaction.amount_capture_rest;

    checkoutTransaction.amount_refund_rest =
      actions.find(
        (actionItem: ActionItemInterface) => actionItem.action === PaymentActionsEnum.Refund,
      )?.refundCaptureType === RefundCaptureTypeEnum.real
        ? unpackedTransaction.amount_refund_rest_with_partial_capture
        : unpackedTransaction.total_left;

    checkoutTransaction.amount_cancel_rest = unpackedTransaction.amount_cancel_rest;
    checkoutTransaction.amount_invoice_rest = unpackedTransaction.amount_invoice_rest;

    return Object.assign({ actions: actions }, checkoutTransaction);
  }
}
