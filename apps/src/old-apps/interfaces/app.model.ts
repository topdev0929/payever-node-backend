import { Document } from 'mongoose';

export interface AppModel extends AppInterface, Document { }

export interface AppInterface {
  access: AccessInterface;
  bootstrapScriptUrl?: string;
  code: string;
  dashboardInfo?: DashboardInfoInterface;
  order: number;
  tag: string;
}

export interface DashboardInfoInterface {
  readonly title: string;
  readonly icon: string;
}

export interface AccessInfoInterface {
  defaultInstalled?: boolean;
  isDefault?: boolean;
  url: string;
}

export interface AccessInterface {
  business?: AccessInfoInterface;
  user?: AccessInfoInterface;
  admin?: AccessInfoInterface;
  partner?: AccessInfoInterface;
}
