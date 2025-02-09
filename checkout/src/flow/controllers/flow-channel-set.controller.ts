import { Controller, Get, NotFoundException, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, ParamModel, Roles, RolesEnum } from '@pe/nest-kit';
import { FastifyReply, FastifyRequest } from 'fastify';
import { BusinessModel } from '../../business';
import { ChannelSetModel, ChannelSetService } from '../../channel-set';
import { environment } from '../../environments';
import { ChannelSetSchemaName } from '../../mongoose-schema';
import { FlowRequestDto, FlowResponseDto } from '../dto';
import { FlowService } from '../services';
import { CHANNEL_SET_ID } from '../../common/constants';

@Controller('flow/channel-set/:channelSetId')
@ApiTags('flow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FlowChannelSetController {
  constructor(
    private readonly flowService: FlowService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  @Get()
  @Roles(RolesEnum.anonymous)
  public async redirectToCheckoutFlow(
    @ParamModel(CHANNEL_SET_ID, ChannelSetSchemaName) channelSet: ChannelSetModel,
    @Req() request: FastifyRequest<any>,
    @Res() response: FastifyReply<any>,
  ): Promise<void> {
    await channelSet.populate('checkout').execPopulate();
    if (!channelSet.checkout) {
      throw new NotFoundException(`ChannelSet "${channelSet.id}" has no checkout.`);
    }

    const business: BusinessModel = await this.channelSetService.getChannelSetBusiness(channelSet);
    const createFlowDto: FlowRequestDto = {
      channelSetId: channelSet.id,
      currency: business.currency,
    };

    const flowResponseDto: FlowResponseDto = await this.flowService.initFlow(
      createFlowDto,
      null,
      request,
    );
    const redirectUrl: string =
      `${environment.frontendCheckoutWrapperMicroUrl}/pay/` +
      `${flowResponseDto.id}?guest_token=${flowResponseDto.guestToken}`;

    response.redirect(302, redirectUrl);
  }
}
