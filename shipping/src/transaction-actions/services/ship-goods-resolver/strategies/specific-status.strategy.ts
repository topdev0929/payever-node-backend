import { ShipGoodsStrategyInterface } from './ship-goods-strategy.interface';
import { GetTransactionActionsDto } from '../../../dto';

export class SpecificStatusStrategy implements ShipGoodsStrategyInterface {
  private specificStatus: string;

  constructor(specificStatus: string) {
    this.specificStatus = specificStatus;
  }

  public canShipGoods(getTransactionActionsDto: GetTransactionActionsDto): boolean {
    return this.specificStatus === getTransactionActionsDto.status.specific;
  }
}
