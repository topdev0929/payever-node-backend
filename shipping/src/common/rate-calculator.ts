import { IntegrationSubscriptionModel, IntegrationRuleModel } from '../integration/models';
import { RateInterface } from '../integration/interfaces';
import { ShippingProductItemDto } from '../shipping/dto/shipping-product-item.dto';
import { RuleRangeModel } from '../integration/models/rules/rule-range.model';

export class RateCalculator {
    private orderTotal: number;
    private totalWeight: number;
    private rules: IntegrationRuleModel[];
    private shippingItems: ShippingProductItemDto[];

    constructor(subscription: IntegrationSubscriptionModel, shippingItemsDto: ShippingProductItemDto[]) {
        this.rules = subscription.rules.filter((rule: IntegrationRuleModel) => rule.isActive !== false);
        this.shippingItems = shippingItemsDto;
        const { orderTotal, totalWeight }: { orderTotal: number; totalWeight: number } = this.shippingItems
            .map((item: ShippingProductItemDto) =>
                ({ orderTotal: item.price * item.quantity, totalWeight: item.weight * item.quantity}))
            .reduce((a: any, b: any) =>
                ({
                    orderTotal: a.orderTotal + b.orderTotal,
                    totalWeight: a.totalWeight + b.totalWeight,
                }),
                    { orderTotal: 0, totalWeight: 0 },
            );
        this.orderTotal = orderTotal;
        this.totalWeight = totalWeight;
    }

    public getRate(): RateInterface {
        const rates: RateInterface[] = this.rules
        .map((rule: IntegrationRuleModel) => ({ integrationRule: rule, rate: rule.flatRate } as RateInterface))
        .filter((result: RateInterface) => result.rate > -1);
        if ( rates.length > 0) {
            return rates.reduce((a: RateInterface, b: RateInterface) => a.rate < b.rate ? a : b);
        }
    }

    public freeOver(rule: IntegrationRuleModel): number {
        if (this.orderTotal >= rule.freeOver) {
            return 0;
        }

        return -1;
    }

    public byWeight(rule: IntegrationRuleModel): number {
        const suitableRanges: RuleRangeModel[] = rule.weightRanges
            .filter((r: RuleRangeModel) => this.totalWeight >= r.from && this.totalWeight <= r.upTo);
        if (suitableRanges.length > 0) {
            return suitableRanges[0].rate;
        }

        return -1;
    }

    public byOrderTotal(rule: IntegrationRuleModel): number {
        const suitableRanges: RuleRangeModel[] = rule.rateRanges
            .filter((r: RuleRangeModel) => this.orderTotal >= r.from && this.orderTotal <= r.upTo);
        if (suitableRanges.length > 0) {
            return suitableRanges[0].rate;
        }

        return -1;
    }
}
