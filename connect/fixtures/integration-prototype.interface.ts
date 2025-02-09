// tslint:disable: max-union-size
import type {
  IntegrationInterface,
  DisplayOptionsInterface,
  InstallationOptionsInterface,
  LinkInterface,
} from '../src/integration/interfaces';
type WithId<T> = T & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};
interface InstallationOptionsPrototype extends InstallationOptionsInterface {
  links: Array<WithId<LinkInterface>>;
}
export interface IntegrationPrototype extends WithId<
  Omit<IntegrationInterface,
    'enabled' | 'order' | 'reviews' | 'versions' | 'timesInstalled' |
    'installationOptions'
  >
> {
  displayOptions: WithId<DisplayOptionsInterface>;
  installationOptions: WithId<Omit<InstallationOptionsPrototype, 'countryList' | 'pricingLink'>> & {
    countryList?: string[];
    pricingLink?: string;
  };
  connect?: {
    dynamicForm?: boolean,
    url: string;
    formAction: {
      actionEndpoint: string;
      initEndpoint: string;
    };
    sendApiKeys?: boolean;
  };
  extension?: any;
  enabled?: boolean;
}
