import { BadRequestException, Injectable } from '@nestjs/common';
import { ActionWrapperDto } from '../../transactions/dto/helpers';
import { OrderService } from './order.service';
import { OrderModel } from '../models';
import { OrderActionsEnum, OrderStatusesEnum } from '../enum';
import { OrderResponseDto } from '../dto';

@Injectable()
export class OrderActionService {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  public async doAction(
    orderModel: OrderModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<OrderResponseDto> {
    const action: OrderActionsEnum = actionWrapper.action as OrderActionsEnum;

    if (!await this.isActionAllowed(orderModel, action)) {
      throw new BadRequestException(`Action ${action} is not allowed`);
    }

    switch (action) {
      case OrderActionsEnum.Cancel:
        return this.orderService.setStatusById(orderModel._id, OrderStatusesEnum.Cancel);
      case OrderActionsEnum.CancelRequest:
        return this.orderService.setStatusById(orderModel._id, OrderStatusesEnum.CancelRequested);
      case OrderActionsEnum.RefundRequest:
        return this.orderService.setStatusById(orderModel._id, OrderStatusesEnum.RefundRequested);
    }
  }

  public async isActionAllowed(orderModel: OrderModel, action: OrderActionsEnum): Promise<boolean> {
    switch (action) {
      case OrderActionsEnum.Cancel:
        return orderModel.status === OrderStatusesEnum.New || orderModel.transactions.length === 0;
      case OrderActionsEnum.CancelRequest:
        return orderModel.status !== OrderStatusesEnum.Fulfilled;
      case OrderActionsEnum.RefundRequest:
        return orderModel.status !== OrderStatusesEnum.Cancel;
      default:
        return false;
    }
  }
}
