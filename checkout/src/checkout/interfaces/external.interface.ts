export interface ShopInterface {
  id: string;
  checkoutId: string;
}

export interface PosTerminalInterface {
  id: string;
  checkoutId: string;
}

export class ExternalAppCreatedDto {
  public id: string;
  public appType: 'shop' | 'pos';
  public business: {
    id: string;
    name: string;
  };
  public totalCount: number;
}
