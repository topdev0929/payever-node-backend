import { ShipGoodsStrategyInterface } from './ship-goods-strategy.interface';
import { GetTransactionActionsDto } from '../../../dto';

export class TimeLimitedPayeverStatusStrategy implements ShipGoodsStrategyInterface {
  private availabilityInMonth: number;
  private payeverStatus: string;
  
  constructor(availabilityInMonth: number, payeverStatus: string) {
    this.availabilityInMonth = availabilityInMonth;
    this.payeverStatus = payeverStatus;
  }

  public canShipGoods(getTransactionActionsDto: GetTransactionActionsDto): boolean {
    const minDate: Date = new Date();
    minDate.setMonth(minDate.getMonth() - this.availabilityInMonth);

    return getTransactionActionsDto.status.general === this.payeverStatus
      && getTransactionActionsDto.transaction.created_at >= minDate;
  }
}
