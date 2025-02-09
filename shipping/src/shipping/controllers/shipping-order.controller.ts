import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Acl, AclActionsEnum, JwtAuthGuard, ParamModel, QueryDto, Roles, RolesEnum } from '@pe/nest-kit';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShippingOrderService } from '../services';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../business/schemas';
import { ShippingOrderModel } from '../models';
import { ShippingOrderSchemaName } from '../schemas';
import {
  GetLabelDto,
  GetOrdersListDto,
  ProcessShippingOrderDto,
  ShippingOrdersPaginatedListDto,
  ShippingOrderStatsDto,
  UpdateShippingOrderDto,
} from '../dto';
import { 
  CreateOrderResponseInterface, 
  DeleteOrderResponseInterface, 
  ShippingSlipInterface, 
  TrackingResponseInterface,
} from '../interfaces';
import { ThirdPartyService } from '../../integration/services';
import { ShippingOrderEventsProducer } from '../producer';
import { FastifyRequest } from 'fastify';
import { FilterConditionsEnum, ShippingStatusEnums } from '../enums';

export const SHIPPING_ORDER_ID: string = ':shippingOrderId';

@Controller('business/:businessId/shipping-orders')
@UseGuards(JwtAuthGuard)
@ApiTags('Business Shipping Orders')
@ApiBearerAuth()
@Roles(RolesEnum.merchant)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ShippingOrderController {
  constructor(
    private readonly shippingOrderService: ShippingOrderService,
    private readonly thirdPartyService: ThirdPartyService,
    private readonly eventProducer: ShippingOrderEventsProducer,
  ) {
  }

  @Get('widget-data')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getStats(
    @Query('from') from: Date,
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<ShippingOrderStatsDto> {
    return this.shippingOrderService.getBusinessShippingOrdersStatistics(business._id, from);
  }

  @Get()
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getShippingOrders(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<ShippingOrderModel[]> {
    return this.shippingOrderService.getBusinessShippingOrdersWithPopulate(business._id);
  }

  @Get('/list')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getProcessedShippingOrders(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
    @QueryDto() dto: GetOrdersListDto,
  ): Promise<ShippingOrdersPaginatedListDto> {
    dto.filters = dto.filters || [];
    dto.filters.push({ field: 'status', condition: FilterConditionsEnum.Is, value: ShippingStatusEnums.Processed });

    return this.shippingOrderService.getPaginatedOrders(dto, business.id);
  }

  @Get('slips')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.read })
  public async getBusinessSlips(
    @ParamModel(':businessId', BusinessSchemaName) business: BusinessModel,
  ): Promise<ShippingSlipInterface[]> {
    const orders: ShippingOrderModel[] = await this.shippingOrderService
      .getBusinessShippingOrdersWithPopulate(business._id);

    return Promise.all(
      orders
        .filter((order: ShippingOrderModel) => order.status === ShippingStatusEnums.Processed)
        .map((order: ShippingOrderModel) => this.shippingOrderService.prepareForSlip(order)),
    );
  }

  @Put(SHIPPING_ORDER_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.update })
  public async updateShippingOrder(
    @ParamModel(SHIPPING_ORDER_ID, ShippingOrderSchemaName) shippingOrder: ShippingOrderModel,
    @Body() dto: UpdateShippingOrderDto,
  ): Promise<ShippingOrderModel> {
    return this.shippingOrderService.update(shippingOrder, dto);
  }

  @Post(SHIPPING_ORDER_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.create })
  public async processShippingOrder(
    @ParamModel(SHIPPING_ORDER_ID, ShippingOrderSchemaName) shippingOrder: ShippingOrderModel,
    @Body() dto: ProcessShippingOrderDto,
    @Req() request: FastifyRequest,
  ): Promise<ShippingOrderModel> {
    if (shippingOrder.status === ShippingStatusEnums.Processed) {
      throw new BadRequestException('Shipping order already processed');
    }

    return this.shippingOrderService.processOrder(dto, shippingOrder, request);
  }

  @Delete(SHIPPING_ORDER_ID)
  @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
  public async deleteShippingOrder(
    @ParamModel(SHIPPING_ORDER_ID, ShippingOrderSchemaName) shippingOrder: ShippingOrderModel,
    @Req() request: FastifyRequest,
  ): Promise<ShippingOrderModel> {
    if (shippingOrder.shippingMethod?.integration.name !== 'custom' && shippingOrder.shipmentNumber) {
      const businessId: string = shippingOrder.businessId;
      const thirdPartName: string = shippingOrder.shippingMethod?.integration.name;
      const deleteShippingOrderResponse: DeleteOrderResponseInterface = await this.thirdPartyService
        .post(
          `business/${ businessId }/integration/${ thirdPartName }/action/delete-order`,
          { shipmentNumber: shippingOrder.shipmentNumber },
          {
            'User-Agent': request.headers['user-agent'],
            'authorization': request.headers.authorization,
          },
        );
      if (!deleteShippingOrderResponse.status) {
        throw new BadRequestException(deleteShippingOrderResponse.errors);
      }
    }

    return this.shippingOrderService
      .update(
        shippingOrder,
        { status: ShippingStatusEnums.Cancelled } as UpdateShippingOrderDto,
      );
  }

  @Get(':shippingOrderId/tracking')
  @Acl({ microservice: 'shipping', action: AclActionsEnum.delete })
  public async trackOrder(
    @ParamModel(SHIPPING_ORDER_ID, ShippingOrderSchemaName) shippingOrder: ShippingOrderModel,
    @Req() request: FastifyRequest,
  ): Promise<TrackingResponseInterface> {
    if (shippingOrder.shippingMethod?.integration.name !== 'custom' && shippingOrder.shipmentNumber) {
      const businessId: string = shippingOrder.businessId;
      const thirdPartName: string = shippingOrder.shippingMethod?.integration.name;

      return this.thirdPartyService
        .post(
          `business/${ businessId }/integration/${ thirdPartName }/action/track-shipment`,
          { trackingNumber: shippingOrder.shipmentNumber },
          {
            'User-Agent': request.headers['user-agent'],
            'authorization': request.headers.authorization,
          },
        );
    }
  }

  @Post(':shippingOrderId/label')
  public async getShippingLabel(
    @ParamModel(SHIPPING_ORDER_ID, ShippingOrderSchemaName) shippingOrder: ShippingOrderModel,
    @Body() dto: GetLabelDto,
    @Req() request: FastifyRequest,
  ): Promise<CreateOrderResponseInterface> {
    if (shippingOrder.status && shippingOrder.status !== ShippingStatusEnums.Processed) {
      throw new BadRequestException('Cannot get a slip for unprocessed order');
    }
    await shippingOrder
      .populate('shippingMethod.integration')
      .execPopulate();
    const businessId: string = shippingOrder.businessId;
    const thirdPartName: string = shippingOrder.shippingMethod?.integration.name;
    const shipmentNumber: string = shippingOrder.trackingId;
    const getLabelResponse: CreateOrderResponseInterface = await this.thirdPartyService
      .post(
        `business/${ businessId }/integration/${ thirdPartName }/action/get-label`,
        { shipmentNumber, ...dto },
        {
          'User-Agent': request.headers['user-agent'],
          'authorization': request.headers.authorization,
        },
      );
    if (!getLabelResponse.status) {
      throw new BadRequestException(getLabelResponse);
    }

    await this.eventProducer.produceLabelDownloadedEvent(shippingOrder);

    return getLabelResponse;
  }

  @Get(':shippingOrderId/slip')
  public async getShippingSlip(
    @ParamModel(SHIPPING_ORDER_ID, ShippingOrderSchemaName) shippingOrder: ShippingOrderModel,
  ): Promise<ShippingSlipInterface> {
    if (shippingOrder.status !== ShippingStatusEnums.Processed) {
      throw new BadRequestException('Cannot get a slip for unprocessed order');
    }

    const shippingSlip: ShippingSlipInterface = await this.shippingOrderService.prepareForSlip(shippingOrder);

    await this.eventProducer.produceSlipDownloadedEvent(shippingOrder);

    return shippingSlip;
  }
}
