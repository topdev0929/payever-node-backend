// tslint:disable: object-literal-sort-keys
import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Roles,
  RolesEnum,
  ParamModel,
  JwtAuthGuard,
  User,
  UserTokenInterface,
  AbstractController,
  Acl,
  AclActionsEnum,
} from '@pe/nest-kit';
import { BusinessSchemaName, BusinessModel } from '@pe/business-kit';
import { MessagingTypeEnum } from '@pe/message-kit';

import {
  AbstractMessaging,
  CommonMessagingService,
} from '../../message/submodules/platform';
import {
  AppChannelDocument,
} from '../../message/submodules/messaging/app-channels';
import {
  APP_NAME_PLACEHOLDER_C,
  APP_NAME_PLACEHOLDER,
  BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
  BUSINESS_ID_PLACEHOLDER,
} from './const';
import { AppChannelHttpResponseDto } from '../../message/dto';
import { appChannelToResponseDto } from '../../message/transformers';
import { VoteCodes } from '../../message/const';

@Controller(`business/${BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C}/messaging/app-channel`)
@ApiTags('messaging/apps-channels')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin, RolesEnum.merchant)
export class AppChannelsController extends AbstractController {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
  ) {
    super();
  }

  @Get(`by-name/${APP_NAME_PLACEHOLDER_C}`)
  @Acl({ microservice: 'message', action: AclActionsEnum.read })
  @ApiResponse({ status: HttpStatus.OK, type: AppChannelHttpResponseDto })
  public async findChannelByAppName(
    @ParamModel(BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C, BusinessSchemaName) business: BusinessModel,
    @Param(BUSINESS_ID_PLACEHOLDER) swaggerBusinessId: string,
    @ParamModel({
      app: APP_NAME_PLACEHOLDER_C,
      business: BUSINESS_ID_NON_GUARDED_PLACEHOLDER_C,
      type: `=${MessagingTypeEnum.AppChannel}`,
    }, AbstractMessaging.name, true) channel: AppChannelDocument,
    @Param(APP_NAME_PLACEHOLDER) swaggerAppName: string,
    @User() userToken: UserTokenInterface,
  ): Promise<AppChannelHttpResponseDto> {
    await this.denyAccessUnlessGranted(VoteCodes.READ_MESSAGING, channel, { userToken });

    return appChannelToResponseDto(await this.commonMessagingService.decryptChat(channel));
  }
}
