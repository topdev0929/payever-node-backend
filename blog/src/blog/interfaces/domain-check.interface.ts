export interface DomainCheckInterface {
  cnames: string[];
  isConnected: boolean;
  currentIp: string;
  currentCname: string;
  requiredIp: string;
  requiredCname: string;
}
