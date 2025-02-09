import { PaymentMethodInterface, ChannelRestrictionsInterface } from '../interfaces';
import { ChannelRestrictionsMapping } from '../config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelFilterService {
  
  public async filter(
    channel: string,
    enabledPaymentMethods: PaymentMethodInterface[],
  ): Promise<PaymentMethodInterface[]> {
    if (!ChannelRestrictionsMapping.has(channel)) {
      return enabledPaymentMethods;
    }
    
    const channelRestrictions: ChannelRestrictionsInterface = ChannelRestrictionsMapping.get(channel);
    
    if (channelRestrictions.allowOnly) {
      enabledPaymentMethods = enabledPaymentMethods.filter((paymentMethod: PaymentMethodInterface) => {
        return channelRestrictions.allowOnly.some(
          (allowedMethod: string) => this.matchPaymentMethod(paymentMethod, allowedMethod),
        );
      });
    }
    
    if (channelRestrictions.exclude) {
      enabledPaymentMethods = enabledPaymentMethods.filter((paymentMethod: PaymentMethodInterface) => {
        return !channelRestrictions.exclude.some(
          (excludedMethod: string) => this.matchPaymentMethod(paymentMethod, excludedMethod),
        );
      });
    }
    
    return enabledPaymentMethods;
  }
  
  private matchPaymentMethod(
    paymentMethod: PaymentMethodInterface,
    methodToMatch: string,
  ): boolean {
    return methodToMatch.indexOf('*') !== -1
      ? !!paymentMethod.payment_method.match(new RegExp(`${methodToMatch}`, 'g'))
      : paymentMethod.payment_method === methodToMatch;
  }
  
}
