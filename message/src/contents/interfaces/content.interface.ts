export interface ContentInterface {
  _id?: string;
  businessId?: string;
  icon?: string;
  name: string;
  url: string;

  children?: ContentInterface[];
}
