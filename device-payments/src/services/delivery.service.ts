import { Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { TransactionsClientParameters } from '../interfaces';
import { TransactionsClient } from './http/transactions-client.service';
import { VerificationType } from '../enum';
import { PaymentAction } from '../enum/payment-action.enum';

interface ActionInterface {
  action: PaymentAction;
}

@Injectable()
export class DeliveryService {
  private action: PaymentAction;

  constructor(
    private readonly logger: Logger,
    private readonly transactionsClient: TransactionsClient,
  ) { }

  public init(
    verificationType: VerificationType,
    parameters: TransactionsClientParameters,
  ): void {
    this.action =
      verificationType === VerificationType.verifyByPayment
        ? PaymentAction.shippingGoods
        : PaymentAction.verify;
    this.transactionsClient.init(parameters);
  }

  public async isDeliveryAllowed(): Promise<boolean> {
    const response: AxiosResponse = await this.transactionsClient.send(
      PaymentAction.list,
    );

    const actions: ActionInterface[] = response.data.actions;

    return actions.some(
      (action: ActionInterface): boolean => this.action === action.action,
    );
  }

  public async deliver(shippingGoodsPayload: { }): Promise<any> {
    if (this.action === PaymentAction.verify) {
      shippingGoodsPayload = Object.assign(shippingGoodsPayload, { fields: { approved: 'true' } });
    }

    return this.transactionsClient.send(this.action, shippingGoodsPayload);
  }
}
