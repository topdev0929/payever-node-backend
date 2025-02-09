import { CouponTypeCustomerEligibilityEnum } from '../enum';

export interface EligibilityReturnType {
    customerEligibility: CouponTypeCustomerEligibilityEnum;
    customerEligibilityCustomerGroups: string[];
    customerEligibilitySpecificCustomers: string[];
}
