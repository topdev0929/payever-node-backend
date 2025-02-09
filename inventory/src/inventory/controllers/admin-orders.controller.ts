import {
  Body, Controller, Get, Patch,
  Post, Delete, UseGuards, HttpCode,
  HttpStatus, Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { OrderSchemaName } from '../../environments/mongoose-schema.names';
import { AdminOrderDto, OrderQueryDto } from '../dto/order';
import { OrderModel } from '../models';
import { OrderService } from '../services';

const ORDER_ID: string = ':orderId';

@Controller('admin/orders')
@ApiTags('admin orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Roles(RolesEnum.admin)
export class AdminOrdersController {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll(
    @Query() query: OrderQueryDto,
  ): Promise<any> {
    return this.orderService.getForAdmin(query);
  }

  @Get(ORDER_ID)
  @HttpCode(HttpStatus.OK)
  public async getById(
    @ParamModel(ORDER_ID, OrderSchemaName) location: OrderModel,
  ): Promise<OrderModel> {
    return location;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(
    @Body() adminOrderDto: AdminOrderDto,
  ): Promise<OrderModel> {
    return this.orderService.createForAdmin(adminOrderDto);
  }

  @Patch(ORDER_ID)
  @HttpCode(HttpStatus.OK)
  public async update(
    @ParamModel(ORDER_ID, OrderSchemaName) order: OrderModel,
    @Body() adminOrderDto: AdminOrderDto,
  ): Promise<OrderModel> {
    return this.orderService.updateForAdmin(order, adminOrderDto);
  }

  @Delete(ORDER_ID)
  @HttpCode(HttpStatus.OK)
  public async delete(
    @ParamModel(ORDER_ID, OrderSchemaName) order: OrderModel,
  ): Promise<OrderModel> {
    return this.orderService.deleteForAdmin(order);
  }

  @Patch(`${ORDER_ID}/release`)
  @HttpCode(HttpStatus.OK)
  public async release(
    @ParamModel(ORDER_ID, OrderSchemaName) order: OrderModel,
  ): Promise<void> {
    await this.orderService.release(order);
  }

  @Patch(`${ORDER_ID}/close`)
  @HttpCode(HttpStatus.OK)
  public async close(
    @ParamModel(ORDER_ID, OrderSchemaName) order: OrderModel,
  ): Promise<void> {
    await this.orderService.close(order);
  }
}
