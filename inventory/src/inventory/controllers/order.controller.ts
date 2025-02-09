import { Body, ConflictException, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName, OrderSchemaName } from '../../environments/mongoose-schema.names';
import { FlowDto } from '../dto/api';
import { OrderModel } from '../models';
import { OrderService } from '../services';

const BUSINESS_ID_PLACEHOLDER: string = ':businessId';
const ORDER_ID_PLACEHOLDER: string = ':orderId';

@Controller('business/:businessId/order')
@ApiTags('business inventory')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @Get()
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.read })
  public async get(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
  ): Promise<OrderModel[]> {
    return this.orderService.findAllByBusiness(business);
  }

  @Get(':orderId')
  @Roles(RolesEnum.anonymous)
  public async getByOrderId(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ORDER_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      OrderSchemaName,
    ) order: OrderModel,
  ): Promise<OrderModel> {
    return order;
  }

  @Post()
  @Roles(RolesEnum.anonymous)
  public async create(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @Body() flowDto: FlowDto,
  ): Promise<OrderModel> {
    return this.orderService.create(
      business,
      flowDto,
      (error: Error) => {
        throw new ConflictException(error);
      },
    );
  }

  @Patch(':orderId')
  @Roles(RolesEnum.anonymous)
  public async change(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ORDER_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      OrderSchemaName,
    ) order: OrderModel,
    @Body() flowDto: FlowDto,
  ): Promise<OrderModel> {
    return this.orderService.update(
      business,
      order,
      flowDto,
      (error: Error) => {
        throw new ConflictException(error);
      },
    );
  }

  @Patch(':orderId/permanent')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async toPermanent(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ORDER_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      OrderSchemaName,
    ) order: OrderModel,
  ): Promise<void> {
    await this.orderService.toPermanent(order);
  }

  @Patch(':orderId/release')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async release(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ORDER_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      OrderSchemaName,
    ) order: OrderModel,
  ): Promise<void> {
    await this.orderService.release(order);
  }

  @Patch(':orderId/close')
  @Roles(RolesEnum.merchant)
  @Acl({ microservice: 'products', action: AclActionsEnum.update })
  public async close(
    @ParamModel(BUSINESS_ID_PLACEHOLDER, BusinessSchemaName) business: BusinessModel,
    @ParamModel(
      {
        _id: ORDER_ID_PLACEHOLDER,
        businessId: BUSINESS_ID_PLACEHOLDER,
      },
      OrderSchemaName,
    ) order: OrderModel,
  ): Promise<void> {
    await this.orderService.close(order);
  }
}
