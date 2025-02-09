export interface CartItemInterface {
  _id: string;
  uuid: string;
  name: string;
  identifier: string;
  thumbnail: string;
  price: number;
  price_net: number;
  vat_rate: number;
  quantity: number;
}
