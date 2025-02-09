import { ShipGoodsStrategyInterface } from './ship-goods-strategy.interface';
import { GetTransactionActionsDto } from '../../../dto';

export class PayeverStatusStrategy implements ShipGoodsStrategyInterface {
  private payeverStatus: string;

  constructor(payeverStatus: string) {
    this.payeverStatus = payeverStatus;
  }

  public canShipGoods(getTransactionActionsDto: GetTransactionActionsDto): boolean {
    return this.payeverStatus === getTransactionActionsDto.status.general;
  }
}
