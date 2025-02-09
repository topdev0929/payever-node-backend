import { CartItemTypeEnum } from '../../../common/enum';

export class FlowCartItemResponseDto {
  public extraData?: { };
  public identifier: string;
  public image?: string;
  public name?: string;
  public originalPrice?: number;
  public price: number;
  public priceNet?: number;
  public productId?: string;
  public quantity: number;
  public sku?: string;
  public totalDiscountAmount?: number;
  public type?: CartItemTypeEnum;
  public vat?: number;
}
