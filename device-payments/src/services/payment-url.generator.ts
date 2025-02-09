import * as queryString from 'querystring';

import { environment } from '../environments';

export class PaymentUrlGenerator {
  public static generate(channelSet: string, queryParts: any): string {
    let url: string = `${environment.checkoutWrapper}/pay/create-flow/channel-set-id/${channelSet}`;

    if (queryParts) {
      url = url + '?' + queryString.stringify(queryParts);
    }

    return url;
  }

  public static generateRestoreFromCodeUrl(paymentCodeId: string): string {
    return `${environment.checkoutWrapper}/pay/restore-flow-from-payment-code/${paymentCodeId}`;
  }
}
