export interface TerminalAccessConfigInterface {
  isLive: boolean;
  internalDomain: string;
  internalDomainPattern: string;
  isLocked: boolean;
  version?: string;
}
