import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User, ParamModel } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { OrderService } from '../services';
import { CreateOrderWrapperDto, OrderResponseDto, ValidateOrderDto } from '../dto';
import { OrderSchemaName } from '../schemas';
import { OrderModel } from '../models';

@Controller('v3/order')
@ApiTags('legacy-api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  @ApiBody({ type: CreateOrderWrapperDto})
  public async createOrder(
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @Body() dto: CreateOrderWrapperDto,
  ): Promise<OrderResponseDto> {
    return this.orderService.processCreateOrder(dto, user);
  }
  
  @Post(':orderId/validate')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.merchant, RolesEnum.oauth)
  public async getOrder(
    @Req() req: FastifyRequest<any>,
    @User() user: AccessTokenPayload,
    @ParamModel( { _id: ':orderId'}, OrderSchemaName) order: OrderModel,
    @Body() dto: ValidateOrderDto,
  ): Promise<void> {
    await this.orderService.validateOrder(order, dto);
  }
  
}
