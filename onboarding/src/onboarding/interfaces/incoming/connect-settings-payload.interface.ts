import { QRTypeEnum } from '../../enums';


export interface BaseSantanderPayloadInterface {
  connectionName?: string;
  password: string;
}
export interface SantanderPayloadInterface extends BaseSantanderPayloadInterface {
  sender: string;
  login: string;
  channel: string;
}


export interface ZiniaPayloadInterface {
  apiKey: string;
  channelId: string;
}

export interface SantanderPosInstallmentInterface extends BaseSantanderPayloadInterface {
  connections: string[];
  vendorNumber: string;
}

export interface TwilioPayloadInterface {
  accountSid: string;
  authToken: string;
}

export interface QrPayloadInterface {
  displayAvatar?: boolean;
  type: QRTypeEnum;
}

export interface DevicePaymentsPayloadInterface {
  secondFactor: boolean;
  autoresponderEnabled: boolean;
  verificationType: number;
}

export interface ConnectSettingsPayloadInterface {
  santander_pos_installment?: SantanderPosInstallmentInterface;
  santander_invoice_de?: SantanderPayloadInterface;
  santander_factoring_de?: SantanderPayloadInterface;
  santander_pos_invoice_de?: SantanderPayloadInterface;
  santander_pos_factoring_de?: SantanderPayloadInterface;
  twilio?: TwilioPayloadInterface;
  qr?: QrPayloadInterface;
  'device-payments'?: DevicePaymentsPayloadInterface;
  zinia_pos?: ZiniaPayloadInterface;
  zinia_pos_de?: ZiniaPayloadInterface;
  zinia_bnpl?: ZiniaPayloadInterface;
  zinia_bnpl_de?: ZiniaPayloadInterface;
  zinia_installment?: ZiniaPayloadInterface;
  zinia_installment_de?: ZiniaPayloadInterface;
  zinia_slice_three?: ZiniaPayloadInterface;
}
