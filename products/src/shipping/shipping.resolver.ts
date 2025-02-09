import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ShippingInterface } from './shipping.interface';
import { ProductInterface } from '../new-products/interfaces/product.interface';

@Resolver('Product')
export class ShippingResolver {
  @ResolveField()
  public shipping(@Parent() product: ProductInterface): ShippingInterface {
    return product.shipping;
  }
}
