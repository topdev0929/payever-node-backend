import { ActionDto, GetTransactionActionsDto } from '../dto';
import { ShippingOrderService } from '../../shipping/services';
import { ShippingOrderModel } from '../../shipping/models';
import { TransactionActionsEnum } from '../enums';
import { ShippingStatusEnums } from '../../shipping/enums';
import { Injectable } from '@nestjs/common';
import { ShipGoodsActionResolver } from './ship-goods-resolver';

@Injectable()
export class ActionsRetrieverService {

  constructor(
    private readonly shippingOrderService: ShippingOrderService,
    private readonly shipGoodsActionResolver: ShipGoodsActionResolver,
  ) { }

  public async retrieveActions(transactionDto: GetTransactionActionsDto): Promise<ActionDto[]> {

    if (!transactionDto.shipping.order_id) {
      return [];
    }

    const order: ShippingOrderModel = await this.shippingOrderService.findOneById(transactionDto.shipping.order_id);
    if (!order || order.status === ShippingStatusEnums.Cancelled) {
      return [];
    }

    const actions: ActionDto[] = [];

    if (order.status !== ShippingStatusEnums.Processed && this.shipGoodsActionResolver.canShipGoods(transactionDto)) {
      actions.push({
        action: TransactionActionsEnum.ProcessShippingOrder,
        enabled: true,
      });
    }

    if (order.status === ShippingStatusEnums.Processed) {
      actions.push({
        action: TransactionActionsEnum.DownloadShippingSlip,
        enabled: true,
      });

      await order.populate('shippingMethod.integration').execPopulate();

      if (order.shippingMethod?.integration.name !== 'custom') {
        actions.push({
          action: TransactionActionsEnum.DownloadShippingLabel,
          enabled: true,
        });

        actions.push({
          action: TransactionActionsEnum.DownloadReturnLabel,
          enabled: true,
        });
      }
    }

    return actions;
  }
}
