import { ActionInterface } from './action.interface';
import { LinkInterface } from './link.interface';

export interface AppInterface {
  key: string;
  category: string;

  title: string;
  description?: string;
  icon?: string;
  image?: string;

  countryList?: string[];

  price?: string;
  developer?: string;
  languages?: string[];

  links?: LinkInterface[];

  enabled: boolean;
  status: string;
  rejectionReason?: string;

  actions?: ActionInterface[];
  events?: string[];
  scopes?: string[];

  connect: {
    action: string;
    form: string;
    url: string;
  };
  clientId: string;
  clientSecret: string;

  apiKey: string;

  owner: string;
}
