import { ForbiddenException, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { Model } from 'mongoose';
import { OrderModel } from '../models';
import { OrderSchemaName } from '../schemas';
import { OrderEventEnum, OrderStatusesEnum } from '../enum';
import { CreateOrderWrapperDto, OrderResponseDto, ValidateOrderDto } from '../dto';
import { plainToClass } from 'class-transformer';
import { OrderInterface } from '../interfaces';
import { AccessTokenPayload, EventDispatcher } from '@pe/nest-kit';
import { OauthService } from '../../common/services';

const OrderMutexKey: string = 'transactions-order';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderModel>,
    private readonly oauthService: OauthService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly mutex: Mutex,
  ) { }

  public async processCreateOrder(
    orderDto: CreateOrderWrapperDto,
    user: AccessTokenPayload,
  ): Promise<OrderResponseDto> {
    const businessId: string = this.oauthService.getOauthUserBusiness(user, orderDto.business_id);

    if (!businessId) {
      if (orderDto.business_id) {
        throw new ForbiddenException(`You're not allowed to create order for business ${orderDto.business_id}`);
      }

      throw new UnauthorizedException('Unauthorized');
    }

    orderDto.business_id = businessId;

    const createdOrder: OrderModel = await this.orderModel.create(orderDto);

    await this.eventDispatcher.dispatch(
      OrderEventEnum.OrderCreated,
      createdOrder,
    );

    return this.orderModelToResultDto(createdOrder);
  }

  public async attachTransactionToOrder(orderId: string, transactionId: string): Promise<OrderModel> {
    return this.mutex.lock(
      OrderMutexKey,
      orderId,
      async () => this.orderModel.findOneAndUpdate(
        { _id: orderId },
        { $addToSet: { transactions: transactionId } },
        { new: true },
      ),
    );
  }

  public async setStatusById(
    orderId: string,
    status: OrderStatusesEnum,
  ): Promise<OrderResponseDto> {
    const updated: OrderModel = await this.mutex.lock(
      OrderMutexKey,
      orderId,
      async () => this.orderModel.findByIdAndUpdate(
        orderId,
        {
          $set: { status },
        },
        {
          new: true,
          upsert: true,
        },
      ),
    );

    return this.orderModelToResultDto(updated.toObject());
  }
  
  public async validateOrder(order: OrderModel, validateOrderDto: ValidateOrderDto): Promise<void> {
    let totalOrderAmountSubmitted: number = 0;
    await order.populate('transactions').execPopulate();
    
    for (const transaction of order.transactions) {
      totalOrderAmountSubmitted += transaction.total ? transaction.total : 0;
    }
    
    const amountLeft: number = order.purchase.amount - totalOrderAmountSubmitted;
    if (validateOrderDto.amount > amountLeft ) {
      throw new BadRequestException(
        `Submitted amount ${validateOrderDto.amount} is more than amount left ${amountLeft}`,
      );
    }
  }

  private async orderModelToResultDto(orderModel: OrderInterface): Promise<OrderResponseDto> {
    return plainToClass<OrderResponseDto, { }>(OrderResponseDto, orderModel);
  }
}
