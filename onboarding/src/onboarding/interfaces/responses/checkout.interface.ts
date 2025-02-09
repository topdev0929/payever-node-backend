/**
 * @ref nodejs-backend/checkout/src/checkout/models/checkout.model.ts
 */
export interface CheckoutInterface {
  _id: string;
  default: boolean;
  settings: {
    styles: {
      button: {
        color: string;
        fill: string;
        text: string;
      };
      page: {
        background: string;
      };
    };
  };
}
