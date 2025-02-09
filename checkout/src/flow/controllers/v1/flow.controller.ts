import {
  Body,
  Controller,
  Get,
  HttpStatus,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  NotFoundException,
  Logger,
  PreconditionFailedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessTokenPayload, JwtAuthGuard, ParamModel, Roles, RolesEnum, User } from '@pe/nest-kit';
import { FlowService, SendToDeviceService } from '../../services';
import {
  FlowAuthorizationRequestDto,
  FlowPatchRequestDto,
  FlowRequestDto,
  FlowResponseDto,
  SendToDeviceRequestDto,
  FlowCallbackListResponseDto,
} from '../../dto';
import { FlowModel } from '../../models';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiCallSchemaName } from '../../../mongoose-schema';
import { API_CALL_ID, FLOW_ID, FLOW_ID_NON_SECURED } from '../../../common/constants';
import { FlowSchemaName } from '../../../mongoose-schema/schemas/flow';
import { ApiCallModel } from '../../../common/models';
import { CallbackTypeEnum } from '../../../common';

@Controller('flow/v1')
@ApiTags('flow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FlowController {
  constructor(
    private readonly flowService: FlowService,
    private readonly sendToDeviceService: SendToDeviceService,
    private readonly logger: Logger,
  ) { }

  @Post()
  @Roles(RolesEnum.anonymous, RolesEnum.merchant, RolesEnum.guest)
  public async initiateCheckoutFlow(
    @Body() flowRequestDto: FlowRequestDto,
    @User() user: AccessTokenPayload,
    @Req() request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {
    return this.flowService.initFlow(flowRequestDto, user, request);
  }

  @Patch(`/${FLOW_ID}`)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async patchCheckoutFlow(
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
    @Body() flowRequestDto: FlowPatchRequestDto,
  ): Promise<FlowResponseDto> {
    return this.flowService.updateFlow(flow, flowRequestDto);
  }

  @Get(`/${FLOW_ID}`)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async getCheckoutFlow(
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
  ): Promise<FlowResponseDto> {
    return this.flowService.prepareFlowResponse(flow);
  }

  @Patch(`/${FLOW_ID}/mark-as-finished`)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async finalizeCheckoutFlow(
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
  ): Promise<FlowResponseDto> {
    return this.flowService.finalizeFlow(flow);
  }

  @Post(`/api-call/${API_CALL_ID}`)
  @Roles(RolesEnum.anonymous)
  public async initiateCheckoutFlowFromApiCall(
    @ParamModel(API_CALL_ID, ApiCallSchemaName) apiCall: ApiCallModel,
    @Req() request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {
    return this.flowService.initFlowFromApiCall(apiCall, request);
  }

  @Post(`/${FLOW_ID_NON_SECURED}/clone`)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async cloneCheckoutFlow(
    @Param('flowIdNonSecured') flowId: string,
    @User() user: AccessTokenPayload,
    @Req() request: FastifyRequest<any>,
  ): Promise<FlowResponseDto> {

    return this.flowService.cloneFlowById(flowId, user, request);
  }

  @Patch(`/${FLOW_ID}/authorization`)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async patchFlowAuthorization(
    @Body() flowAuthorizationRequestDto: FlowAuthorizationRequestDto,
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
  ): Promise<void> {
    await this.flowService.authorizeFlow(flow, flowAuthorizationRequestDto);
  }

  @Post(`/${FLOW_ID}/send-to-device`)
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.anonymous)
  public async sendAction(
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
    @Body() dto: SendToDeviceRequestDto,
  ): Promise<void> {
    await this.sendToDeviceService.sendToDevice(flow, dto);
  }

  @Get(`/${FLOW_ID}/callbacks`)
  @Roles(RolesEnum.merchant, RolesEnum.guest)
  public async getCheckoutFlowCallbacks(
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
  ): Promise<FlowCallbackListResponseDto> {
    return this.flowService.prepareCallbacksResponse(flow);
  }

  @Get(`/${FLOW_ID}/callback/:callbackType`)
  @Roles(RolesEnum.anonymous)
  public async callCallback(
    @ParamModel(FLOW_ID, FlowSchemaName) flow: FlowModel,
    @Param('callbackType') callbackType: CallbackTypeEnum,
    @Res() res: FastifyReply<any>,
    @Req() request: FastifyRequest,
  ): Promise<void> {
    this.logger.log({
      flow: flow.id,
      message: 'Received checkout flow callback: ' + callbackType,
    });

    const redirectUrl: string = await this.flowService.getCallbackUrl(flow, callbackType);
    if (!redirectUrl) {
      throw new NotFoundException(`Redirect url not defined`);
    }

    const doNotOverride: CallbackTypeEnum[] = [CallbackTypeEnum.failure, CallbackTypeEnum.success];
    if (doNotOverride.includes(flow.callbackType)) {
      throw new PreconditionFailedException('Callback was already called');
    }

    await this.flowService.saveTriggeredCallbackUrl(flow, callbackType);

    this.logger.log({
      flow: flow.id,
      message: 'Successfully processed checkout flow callback: ' + callbackType,
      redirectUrl,
    });

    res
      .status(HttpStatus.MOVED_PERMANENTLY)
      .redirect(redirectUrl);
  }
}
