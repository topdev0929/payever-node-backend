/* eslint-disable max-len */
/**
 * 
 * @ref https://gitlab.devpayever.com/nodejs-backend/connect/blob/425127e6931fb27e8f0985b086b2635646c525e3/src/integration/producer/event.producer.ts#L39
 */
export class ConnectThirdPartyEnabledDto {
  public businessId: string;
  /**
   * @description connect integration category name
   * @example `communications`, `messaging`, `shopsystems`, `products`
   */
  public category: string;
  /**
   * @description connect integration name
   * @example `twilio`, `ebay`, `santander_installment_no`
   */
  public name: string;
}
