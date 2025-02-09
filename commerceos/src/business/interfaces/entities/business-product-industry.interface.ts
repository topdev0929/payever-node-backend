export interface BusinessProductIndustryInterface {
  readonly code: string;
  order: number;
  readonly industries: BusinessProductIndustryInterface[];
}
