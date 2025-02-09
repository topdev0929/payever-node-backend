import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, Acl, AclActionsEnum, ParamModel } from '@pe/nest-kit';
import { AccessTokenPayload, JwtAuthGuard, Roles, RolesEnum, User } from '@pe/nest-kit/modules/auth';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SubscriptionMediaModel, UserMediaModel } from '../models';
import { SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';
import { MediaStreamService, SubscriptionMediaService, UserMediaService } from '../services';
import { UserMediaReadVoter, UserSubscriptionMediaReadVoter } from '../voters';

@Controller(':businessId/stream')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('Stream Media API')
export class MediaStreamController extends AbstractController{
  constructor(
    private readonly subscriptionMediaService: SubscriptionMediaService,
    private readonly userMediaService: UserMediaService,
    private readonly mediaStreamService: MediaStreamService,
  ) {
    super();
  }

  @Get('/subscription/:subscriptionMediaId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async streamSubscriptionMediaById(
    @User() user: AccessTokenPayload,
    @ParamModel('subscriptionMediaId', SubscriptionMediaSchemaName) subscriptionMedia: SubscriptionMediaModel,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserSubscriptionMediaReadVoter.READ, subscriptionMedia, user);
    await this.mediaStreamService.streamMedia(
      subscriptionMedia.url, 
      res, 
      subscriptionMedia.mediaType, 
      req.headers.range,
    );
  }

  @Get('/media/:userMediaId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.read })
  public async findById(
    @ParamModel('userMediaId', UserMediaSchemaName) userMedia: UserMediaModel,
    @User() user: AccessTokenPayload,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserMediaReadVoter.READ, userMedia, user);
    await this.mediaStreamService.streamMedia(userMedia.url, res, userMedia.mediaType, req.headers.range);
  }
}
