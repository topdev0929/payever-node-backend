import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { ChannelSetModel } from '../../channel-set';
import { ChannelSetSchemaName } from '../../mongoose-schema';
import { AttachFlowCheckoutDto } from '../dto';
import { FlowModel } from '../models';
import { FlowSchemaName } from '../../mongoose-schema/schemas/flow';

const CHANNEL_SET_ID_PLACEHOLDER: string = ':channelSetId';

/** @deprecated use ./v1/flow-controller.ts */
@Controller('checkout/v1/flow/:flowId')
@ApiTags('flow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CheckoutFlowController {
  constructor(
  ) { }

  @Get('checkout')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async getFlowCheckout(
    @ParamModel({ flowId: ':flowId' }, FlowSchemaName) flow: FlowModel,
  ): Promise<void> {
    throw new NotImplementedException('This endpoint is deprecated and should not be used');
  }

  @Put('checkout')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async setFlowCheckout(
    @Param('flowId') flowId: string,
    @Body() body: AttachFlowCheckoutDto,
  ): Promise<void> {
    throw new NotImplementedException('This endpoint is deprecated and should not be used');
  }

  @Post('channel-set/:channelSetId')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async setFlowCheckoutByChannelSet(
    @ParamModel(CHANNEL_SET_ID_PLACEHOLDER, ChannelSetSchemaName) channelSet: ChannelSetModel,
    @Param('flowId') flowId: string,
  ): Promise<[]> {
    throw new NotImplementedException('This endpoint is deprecated and should not be used');
  }
}
