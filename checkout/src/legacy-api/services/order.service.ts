import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderSchemaName } from '../../mongoose-schema';
import { OrderModel } from '../models';
import { AccessTokenPayload } from '@pe/nest-kit';
import { LegacyApiResponseTransformerService } from './legacy-api-response-transformer.service';
import { OauthService } from '../../common/services';
import { CreatePaymentValidator } from '../validation';
import { OrderIncomingDto } from '../dto';
import { classToPlain } from 'class-transformer';
import { Mutex } from '@pe/nest-kit/modules/mutex';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderSchemaName) private readonly orderModel: Model<OrderModel>,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly oauthService: OauthService,
    private readonly createPaymentValidator: CreatePaymentValidator,
    private readonly mutex: Mutex,
  ) { }

  public async createOrUpdateOrderFromEvent(data: OrderIncomingDto): Promise<OrderModel> {
    const plainOrder: any = classToPlain(data);

    return this.mutex.lock(
      'checkout-orders',
      plainOrder.id,
      async () => this.orderModel.findOneAndUpdate(
        { _id: plainOrder.id },
        { $set: plainOrder },
        { new: true, upsert: true },
      ),
    );
  }

  public async getOrderById(orderId: string): Promise<OrderModel> {
    return this.orderModel.findById(orderId);
  }

  public async getPlainOrderById(orderId: string): Promise<OrderModel> {
    return this.orderModel.findById(orderId).lean();
  }

  public async getOrderByIdWithAccess(
    orderId: string,
    user: AccessTokenPayload,
  ): Promise<OrderModel> {
    const order: OrderModel = await this.getOrderById(orderId);
    if (!order) {
      throw new HttpException(`The order by "${orderId}" was not found`, HttpStatus.NOT_FOUND);
    }

    const businessId: string = this.oauthService.getOauthUserBusiness(user, order.business_id);

    if (!businessId) {
      throw new HttpException(
        `You are not allowed to access order "${orderId}"`,
        HttpStatus.FORBIDDEN,
      );
    }

    return order;
  }
}
