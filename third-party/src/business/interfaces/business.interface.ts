import { IntegrationSubscriptionInterface } from '@pe/third-party-sdk';
import { 
  CompanyAddressInterface, 
  ContactDetailsInterface,
  BankAccountInterface,
  BusinessInterface as KitBusinessInterface,
} from '@pe/business-kit';

export interface BusinessInterface  extends KitBusinessInterface {
  subscriptions: IntegrationSubscriptionInterface[];
  currency?: string;
  companyAddress: CompanyAddressInterface;
  contactDetails?: ContactDetailsInterface;
  bankAccount?: BankAccountInterface;
  contactEmails?: string[];
}
