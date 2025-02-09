import { Injectable } from '@nestjs/common';
import { AbstractVoter, AccessTokenPayload, Voter } from '@pe/nest-kit';
import { ProductInterface, ProductsService } from '@pe/subscriptions-sdk/modules';
import { SubscriptionMediaTypeEnum } from '../enums';
import { SubscriptionMediaInterface } from '../interfaces';

@Voter()
@Injectable()
export class UserSubscriptionMediaReadVoter extends AbstractVoter {
  public static readonly READ: string = 'subscription-media-read';

  constructor(
    private readonly productsService: ProductsService,
  ) {
    super();
  }
  
  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === UserSubscriptionMediaReadVoter.READ && UserSubscriptionMediaReadVoter.isSubscription(subject);
  }

  protected async voteOnAttribute(
    attribute: string, 
    subscriptionMedia: SubscriptionMediaInterface, 
    user: AccessTokenPayload,
  ): Promise<boolean> {
    const product: ProductInterface[] = await this.productsService.getAvailableProducts(user.id);
    let subscriptionTypeLevel: number;

    // todo: remove default level 0 if this subscription product really implemented
    if (product.length === 0) {
      subscriptionTypeLevel = 0;
    } else {
      const subscriptionType: SubscriptionMediaTypeEnum = product[0].features.name;
      subscriptionTypeLevel = parseInt(SubscriptionMediaTypeEnum[subscriptionType], 10);
    }

    return subscriptionMedia.subscriptionType > subscriptionTypeLevel ? false : true;
  }

  protected static isSubscription(subject: any): subject is SubscriptionMediaInterface {
    return subject.subscriptionType !== undefined;
  }
}
