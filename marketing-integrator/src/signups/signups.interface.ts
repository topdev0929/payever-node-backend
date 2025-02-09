export interface SignupsInterface {
  baseCrmClientId?: number;
  utm_source?: string;
  app: string;
  form_name?: string;
  full_name: string;
  email: string;
  phone: string;
  pricing?: string;
  business_name?: string;
  website_url?: string;
  country_code?: string;
  source_host: string;
  followupsSent?: number[];
}
