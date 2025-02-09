import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentWrapperDto } from '../dto/request/v3';
import { OrderModel } from '../models';
import { AccessTokenPayload } from '@pe/nest-kit';
import { OrderService } from '../services/order.service';

@Injectable()
export class PaymentOrderValidator {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  public async validate(
    paymentDto: CreatePaymentWrapperDto,
    user: AccessTokenPayload,
  ): Promise<void> {
    const orderId: string = paymentDto.order_id;
    if (!orderId) {
      return;
    }

    const order: OrderModel = await this.orderService.getOrderByIdWithAccess(orderId, user);

    if (!order) {
      throw new HttpException(`The order by "${orderId}" was not found`, HttpStatus.NOT_FOUND);
    }
  }
}
