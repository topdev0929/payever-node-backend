import { ShipGoodsStrategyInterface } from './ship-goods-strategy.interface';
import { GetTransactionActionsDto } from '../../../dto';

export class TimeLimitedSpecificStatusStrategy implements ShipGoodsStrategyInterface {
  private availabilityInMonth: number;
  private specificStatus: string;
  
  constructor(availabilityInMonth: number, specificStatus: string) {
    this.availabilityInMonth = availabilityInMonth;
    this.specificStatus = specificStatus;
  }

  public canShipGoods(getTransactionActionsDto: GetTransactionActionsDto): boolean {
    const minDate: Date = new Date();
    minDate.setMonth(minDate.getMonth() - this.availabilityInMonth);

    return getTransactionActionsDto.status.specific === this.specificStatus
      && getTransactionActionsDto.transaction.created_at >= minDate;
  }
}
