export interface CheckDomainStatusResultInterface {
    cnames: string[];
    isConnected: boolean;
    requiredIp: string;
    ownDomain: string;
}
