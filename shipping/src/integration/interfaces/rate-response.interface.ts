import { ShippingMethodInterface } from '../../shipping/interfaces';

export interface RateResponseInterface {
  shippingOrderId: string;
  methods: ShippingMethodInterface[];
}
