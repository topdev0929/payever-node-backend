import { BusinessReferenceDto } from '../business-reference.dto';
import { ProductReferenceDto } from '../';

export class ProductSubscriptionDeletedDto {
  public marketplaceProduct: ProductReferenceDto;
  public business: BusinessReferenceDto;
  public product: ProductReferenceDto;
}
