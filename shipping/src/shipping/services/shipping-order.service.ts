import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FastifyRequest } from 'fastify';
import { Model } from 'mongoose';

import { ShippingOrderSchemaName } from '../schemas';
import {
  CreateShippingOrderDto,
  FilterDto,
  GetOrdersListDto,
  ProcessShippingOrderDto,
  ShippingOrdersPaginatedListDto,
  ShippingOrderStatsDto,
  UpdateShippingOrderDto,
} from '../dto';
import { FilterConditionsEnum, ShippingOrderEventsEnum, ShippingStatusEnums } from '../enums';
import { MongoFiltersBuilderHelper } from '../helpers';
import { ShippingOrderModel } from '../models/';
import { SelectShippingMethodDto } from '../../channel-set/dto';
import {
  CreateOrderResponseInterface,
  ShippingMethodInterface,
  ShippingSlipInterface,
  ValidateResponseInterface,
} from '../interfaces';
import { ShippingOrderEventsProducer } from '../producer';
import { ThirdPartyService } from '../../integration/services';
import { ShippingOrderElasticService } from './shipping-order-elastic.service';
import { EventDispatcher } from '@pe/nest-kit';

@Injectable()
export class ShippingOrderService {
  private logger: Logger = new Logger(ShippingOrderService.name, true);

  constructor(
    @InjectModel(ShippingOrderSchemaName) private readonly shippingOrderModel: Model<ShippingOrderModel>,
    private readonly thirdPartyService: ThirdPartyService,
    private readonly eventDispatcher: EventDispatcher,

  ) { }

  public async create(dto: CreateShippingOrderDto): Promise<ShippingOrderModel> {
    const shippingOrder: ShippingOrderModel = await this.shippingOrderModel.create(dto as any);

    await this.eventDispatcher.dispatch(ShippingOrderEventsEnum.ShippingOrderCreated, shippingOrder);

    return shippingOrder;
  }

  public async findOneById(id: string): Promise<ShippingOrderModel> {
    return this.shippingOrderModel.findById(id).exec();
  }

  public async update(
    shippingOrderModel: ShippingOrderModel,
    dto: UpdateShippingOrderDto,
  ): Promise<ShippingOrderModel> {
    shippingOrderModel.set(dto);
    await shippingOrderModel.save();

    await this.eventDispatcher.dispatch(ShippingOrderEventsEnum.ShippingOrderUpdated, shippingOrderModel);

    return shippingOrderModel;
  }

  public async deleteOneById(id: string): Promise<ShippingOrderModel> {
    const shippingOrder: ShippingOrderModel = 
      await this.shippingOrderModel.findOneAndDelete({ _id: id }).exec();

    await this.eventDispatcher.dispatch(ShippingOrderEventsEnum.ShippingOrderRemoved, shippingOrder);

    return shippingOrder;
  }

  public async processOrder(
    dto: ProcessShippingOrderDto,
    shippingOrder: ShippingOrderModel,
    request: FastifyRequest,
  ): Promise<ShippingOrderModel> {
    if (shippingOrder.status === ShippingStatusEnums.Processed) {
      return null;
    }
    await shippingOrder
      .populate('shippingOrigin')
      .populate('shippingMethod.integration')
      .execPopulate();

    if (shippingOrder.shippingMethod?.integration.name !== 'custom') {
      await this.processThirdPartyShipping(shippingOrder, dto.shippedAt, request);
    }

    const updatedOrder: ShippingOrderModel = await this.shippingOrderModel.findOneAndUpdate(
      { _id: shippingOrder._id },
      {
        $set: {
          processedAt: new Date(),
          status: ShippingStatusEnums.Processed,
          ...dto,
        } as ShippingOrderModel,
      },
      { new: true },
    );

    await this.populateOne(updatedOrder);

    await this.eventDispatcher.dispatch(ShippingOrderEventsEnum.ShippingOrderProcessed, updatedOrder);

    return updatedOrder;
  }

  public async selectMethod(dto: SelectShippingMethodDto): Promise<ShippingOrderModel> {
    const shippingOrderModel: ShippingOrderModel = await this.findOneById(dto.shippingOrderId);
    if (!shippingOrderModel) {
      throw new NotFoundException(`Shipping Order with id ${ dto.shippingOrderId } not found`);
    }
    const method: ShippingMethodInterface = shippingOrderModel.shippingMethod;
    if (!method) {
      throw new BadRequestException('This method not allows for the shipping order');
    }

    return this.shippingOrderModel.findOneAndUpdate(
      { _id: dto.shippingOrderId },
      { $set: { shippingMethod: method } as ShippingOrderModel, $unset: { methods: 1 } },
    ).exec();
  }

  public async getBusinessShippingOrders(businessId: string): Promise<ShippingOrderModel[]> {
    return this.shippingOrderModel.find({ businessId: businessId });
  }

  public async getBusinessShippingOrdersStatistics(businessId: string, from: Date): Promise<ShippingOrderStatsDto> {
    const returnedQuery: any = {
      createdAt: { $gte: from },
      status: ShippingStatusEnums.Returned,
    };

    const cancelledQuery: any = {
      status: ShippingStatusEnums.Cancelled,
      updatedAt: { $gte: from },
    };

    const shippedQuery: any = {
      shippedAt: { $gte: from },
    };

    return {
      cancelled:  await this.shippingOrderModel.count(cancelledQuery).exec(),
      return: await this.shippingOrderModel.count(returnedQuery).exec(),
      shipped:  await this.shippingOrderModel.count(shippedQuery).exec(),
    };
  }

  public async getBusinessShippingOrdersWithPopulate(businessId: string): Promise<ShippingOrderModel[]> {
    return this.shippingOrderModel
      .find({ businessId: businessId })
      .populate('shippingOrigin')
      .populate('shippingMethod.integration')
      .populate('shippingMethod.integrationRule')
      .exec();
  }

  public async populateOne(model: ShippingOrderModel): Promise<ShippingOrderModel> {
    return model
      .populate('shippingOrigin')
      .populate('shippingMethod.integration')
      .populate('shippingMethod.integrationRule')
      .execPopulate();
  }

  public async prepareForSlip(model: ShippingOrderModel): Promise<ShippingSlipInterface> {
    await model.populate('shippingOrigin').execPopulate();

    return {
      billingAddress: model.billingAddress,
      businessName: model.businessName,
      from: model.shippingOrigin,
      legalText: model.legalText,
      processedAt: model.processedAt,
      products: model.shippingItems,
      to: model.shippingAddress,
    } as ShippingSlipInterface;
  }

  public async getPaginatedOrders(dto: GetOrdersListDto, businessId: string): Promise<ShippingOrdersPaginatedListDto> {
    const filters: FilterDto[] = dto.filters;
    dto.page = dto.page > 0 ? dto.page : 1;
    dto.perPage = dto.perPage > 0 ? dto.perPage : 10;

    filters.push({ field: 'businessId', condition: FilterConditionsEnum.Is, value: businessId });

    const query: any = MongoFiltersBuilderHelper.getMongoQuery(filters);

    const total: number = await this.shippingOrderModel.countDocuments(query);
    const list: ShippingOrderModel[] = await this.shippingOrderModel
      .find(query)
      .skip((dto.page - 1) * dto.perPage)
      .limit(dto.perPage);

    return {
      list,
      page: dto.page,
      perPage: dto.perPage,
      total,
    };
  }

  private async processThirdPartyShipping(
    shippingOrder: ShippingOrderModel,
    shippedAt: string,
    request: FastifyRequest,
  ): Promise<any> {
    const createOrderData: any = {
      serviceCode: shippingOrder.shippingMethod?.serviceCode,
      shipFrom: shippingOrder.shippingOrigin,
      shipTo: shippingOrder.shippingAddress,
      shippingBox: shippingOrder.shippingBoxes && shippingOrder.shippingBoxes[0],
      shippingOrderId: shippingOrder._id,
    };
    if (shippedAt) {
      createOrderData.shippedAt = shippedAt;
    }
    const thirdPartName: string = shippingOrder.shippingMethod?.integration.name;

    const baseUrl: string = `business/${ shippingOrder.businessId || shippingOrder.business }/integration/${ thirdPartName }/action`;

    const validateShippingOrderResponse: ValidateResponseInterface = await this.thirdPartyService
      .post(
        baseUrl + `/validate-order`,
        createOrderData,
        {
          'User-Agent': request.headers['user-agent'],
          'authorization': request.headers.authorization,
        },
      );

    if (!validateShippingOrderResponse.status) {
      this.logger.error(validateShippingOrderResponse.errors, shippingOrder.id);
      throw new UnprocessableEntityException(validateShippingOrderResponse.errors);
    }

    const createShippingOrderResponse: CreateOrderResponseInterface = await this.thirdPartyService
      .post(
        baseUrl + `/create-order`,
        { ...createOrderData, state: validateShippingOrderResponse.state },
        {
          'User-Agent': request.headers['user-agent'],
          'authorization': request.headers.authorization,
        },
      );
    
    if (!createShippingOrderResponse.status) {
      this.logger.error(createShippingOrderResponse.errors, shippingOrder.id);
      throw new UnprocessableEntityException(createShippingOrderResponse.errors);
    }
    await this.update(
      shippingOrder,
      {
        label: createShippingOrderResponse.label,
        shipmentNumber: createShippingOrderResponse.shipmentNumber,
        trackingId: createShippingOrderResponse.shipmentNumber,
        trackingUrl: createShippingOrderResponse.trackingUrl,
      } as UpdateShippingOrderDto,
    );
  }
}
