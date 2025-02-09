import { Body, Controller, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { RateResponseInterface } from '../../integration/interfaces';
import { ShippingOrderModel } from '../../shipping/models';
import { ShippingOrderService } from '../../shipping/services';
import { GetRatesRequestDto, SelectShippingMethodDto } from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetSchemaName } from '../schemas';
import { ChannelSetService } from '../services/channel-set.service';

@Controller('channel-set')
@UseGuards(JwtAuthGuard)
@ApiTags('Channel Set')
@ApiBearerAuth()
@Roles(RolesEnum.anonymous)
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid authorization token.' })
@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
export class ChannelSetController {
  constructor(
    private readonly shippingOrderService: ShippingOrderService,
    private readonly channelSetService: ChannelSetService,
  ) {
  }

  @Post('/:channelSetId/shipping/methods')
  public async getRates(
    @ParamModel(':channelSetId', ChannelSetSchemaName) channelSet: ChannelSetModel,
    @Body() dto: GetRatesRequestDto,
  ): Promise<RateResponseInterface> {

    return this.channelSetService.getMethods(channelSet, dto.shippingAddress, dto.shippingItems);
  }

  @Post('/:channelSetId/shipping/select-method')
  public async selectMethod(
    @Body() dto: SelectShippingMethodDto,
  ): Promise<ShippingOrderModel> {
    return this.shippingOrderService.selectMethod(dto);
  }

  @Post('shipping/methods')
  public async getRatesByQuery(
    @Query('channelSet') channelSetId: string,
    @Body() dto: GetRatesRequestDto,
  ): Promise<RateResponseInterface> {
    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(channelSetId);

    return this.channelSetService.getMethods(channelSet, dto.shippingAddress, dto.shippingItems);
  }
}
