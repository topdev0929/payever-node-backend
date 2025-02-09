import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, ParamModel } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SubscriptionMediaModel, UserMediaModel } from '../../models';
import { SubscriptionMediaSchemaName, UserMediaSchemaName } from '../../schemas';
import { MediaStreamService } from '../../services';


const USER_MEDIA_ID: string  = ':subscriptionMediaId';
const SUBSCRIPTION_MEDIA_ID: string  = ':subscriptionMediaId';

@Controller('admin/stream')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.admin)
@ApiTags('admin media streams')
export class AdminMediaStreamsController extends AbstractController{
  constructor(
    private readonly mediaStreamService: MediaStreamService,
  ) {
    super();
  }

  @Get(`subscription/${SUBSCRIPTION_MEDIA_ID}`)
  public async streamSubscriptionMediaById(
    @ParamModel(SUBSCRIPTION_MEDIA_ID, SubscriptionMediaSchemaName) subscriptionMedia: SubscriptionMediaModel,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {
    await this.mediaStreamService.streamMedia(
      subscriptionMedia.url, 
      res, 
      subscriptionMedia.mediaType, 
      req.headers.range,
    );
  }


  @Get(`media/${USER_MEDIA_ID}`)  
  public async findById(
    @ParamModel(USER_MEDIA_ID, UserMediaSchemaName) userMedia: UserMediaModel,    
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply<any>,
  ): Promise<void> {    
    await this.mediaStreamService.streamMedia(userMedia.url, res, userMedia.mediaType, req.headers.range);
  }
}
