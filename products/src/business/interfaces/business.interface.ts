export interface BusinessInterface {
  companyAddress: {
    country: string;
    city: string;
    street: string;
    zipCode: string;
  };
  currency: string;
  defaultLanguage?: string;
  name: string;
}
