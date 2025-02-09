import { BlogInterface } from '../../blog/interfaces';

export interface BusinessInterface {
  blogs: BlogInterface[];
  name: string;
  primaryColor?: string;
  secondaryColor?: string;
  primaryTransparency?: string;
  secondaryTransparency?: string;
  defaultLanguage: string;
}
