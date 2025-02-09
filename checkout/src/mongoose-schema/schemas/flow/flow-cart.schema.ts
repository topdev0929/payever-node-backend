import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { FlowCartAttributesSchema } from './flow-cart-attributes.schema';
import { CartItemTypeEnum } from '../../../common/enum';

export const FlowCartSchema: Schema = new Schema({
  _id: { type: String, default: uuid },

  extraData: { type: Schema.Types.Mixed },
  identifier: { type: String },
  image: { type: String },
  name: { type: String },
  originalPrice: { type: Number },
  price: { type: Number },
  priceNet: { type: Number },
  productId: { type: String },
  quantity: { type: Number },
  sku: { type: String },
  vat: { type: Number },

  attributes: { type: FlowCartAttributesSchema },
  brand: { type: String },
  category: { type: String },
  imageUrl: { type: String },
  productUrl: { type: String },
  totalAmount: { type: Number },
  totalDiscountAmount: { type: Number },
  totalTaxAmount: { type: Number },
  type: { type: CartItemTypeEnum },
});
