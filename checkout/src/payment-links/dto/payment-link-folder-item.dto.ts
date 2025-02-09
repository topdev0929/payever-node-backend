import { PaymentLinkFolderItemInterface } from '../interfaces';

export class PaymentLinkFolderItemDto implements PaymentLinkFolderItemInterface {
  public _id: string;
  public serviceEntityId?: string;
  public businessId: string;
  public amount: number;
  public createdAt: Date;
  public expiresAt: Date;
  public isActive: boolean;
  public creator: string;
  public isDeleted: boolean;
  public paymentLink?: string;
  public transactionsCount?: number;
  public viewsCount?: number;
}
