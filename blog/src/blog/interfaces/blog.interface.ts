import { BaseBlogInterface } from './base-blog.interface';

export interface BlogInterface extends BaseBlogInterface {
  name: string;
  picture: string;
  isDefault: boolean;
}

