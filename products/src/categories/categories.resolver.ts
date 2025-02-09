import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { CategoryInterface } from './category.interface';
import { ProductInterface } from '../new-products/interfaces/product.interface';

@Resolver('Product')
export class CategoriesResolver {
  @ResolveField()
  public categories(@Parent() product: ProductInterface): CategoryInterface[] {
    return product.categories;
  }
}
