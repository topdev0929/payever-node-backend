import { GetTransactionActionsDto } from '../../../dto';

export interface ShipGoodsStrategyInterface {
  canShipGoods(getTransactionActionsDto: GetTransactionActionsDto): boolean;
}
