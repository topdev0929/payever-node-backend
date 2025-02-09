import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ChannelSetInterface } from './channel-set.interface';
import { ProductInterface } from '../new-products/interfaces/product.interface';

@Resolver('Product')
export class ChannelSetsResolver {
  @ResolveField()
  public channelSets(@Parent() product: ProductInterface): ChannelSetInterface[] {
    return product.channelSets;
  }
}
