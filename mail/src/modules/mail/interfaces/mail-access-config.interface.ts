export interface MailAccessConfigInterface {
  isLive: boolean;
  internalDomain: string;
  internalDomainPattern: string;
  isLocked: boolean;
  version?: string;
}
