import { VerificationType } from '../enum';

export interface BusinessInterface {
  _id: any;
  businessId: string;
  defaultTerminalId?: string;
  defaultApplications?: any[];
  settings: {
    secondFactor: boolean;
    enabled?: boolean;
    verificationType: VerificationType;
    autoresponderEnabled: boolean;
  };
}
