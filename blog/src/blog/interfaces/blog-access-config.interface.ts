import { BlogInterface } from './blog.interface';
export interface BlogAccessConfigInterface {
  blog: BlogInterface;
  isLive: boolean;
  internalDomain: string;
  internalDomainPattern: string;
  ownDomain: string;
  isLocked: boolean;
  isPrivate: boolean;
  privateMessage: string;
  privatePassword: string;
  socialImage: string;
  version?: string;
}
