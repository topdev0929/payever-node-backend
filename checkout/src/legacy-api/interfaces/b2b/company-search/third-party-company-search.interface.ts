export interface ThirdPartyCompanySearchInterface {
  company: {
    type?: string;
    name?: string;
    externalId?: string;
    vatId?: string;
    registrationId?: string;
    getLegalForm?: boolean;
    getCreditLine?: boolean;
  };
  address: {
    city?: string;
    phone?: string;
    streetName?: string;
    streetNumber?: string;
    zip?: string;
    country?: string;
  };
}
