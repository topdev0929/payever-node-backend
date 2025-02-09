import { CartItemInterface } from './cart-item.interface';

export interface ApplyCouponResponseInterface {
  cart: CartItemInterface[];
  appliedOn?: Array<{
    identifier: string;
    discountValue?: number;
    reduction?: number;
  }>;
  freeShipping?: boolean;
}
