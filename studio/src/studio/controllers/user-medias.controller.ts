import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AbstractController, AccessTokenPayload, Acl, AclActionsEnum, ParamModel, User } from '@pe/nest-kit';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../business/schemas';
import { IdsDto } from '../dto';
import { UserAlbumModel, UserMediaModel } from '../models';
import { UserAlbumSchemaName } from '../schemas';
import { UserAlbumService, UserMediaService } from '../services';
import { UserAlbumReadVoter, UserMediasRemoveVoter, UserMediasUpdateVoter } from '../voters';

@Controller(':businessId/medias')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.merchant)
@ApiTags('User Album API')
export class UserMediasController extends AbstractController{
  constructor(
    private readonly userAlbumService: UserAlbumService,
    private readonly userMediaService: UserMediaService,
  ) {
    super();
  }

  @Post('/add/album/:userAlbumId')
  @Acl({ microservice: 'studio', action: AclActionsEnum.create })
  public async addMultipleMedia(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @ParamModel('userAlbumId', UserAlbumSchemaName) userAlbum: UserAlbumModel,
    @User() user: AccessTokenPayload,
    @Body() body: IdsDto,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, userAlbum, user);

    return this.userMediaService.addMultipleMediaToAlbum(userAlbum.id, body, business);
  }

  @Post('/remove/album')
  @Acl({ microservice: 'studio', action: AclActionsEnum.update })
  public async removeMultipleMediaToAlbum(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @User() user: AccessTokenPayload,
    @Body() body: IdsDto,
  ): Promise<void> {
    const userMedias: UserMediaModel[] = await this.userMediaService.findByIds(body);
    await this.denyAccessUnlessGranted(UserMediasUpdateVoter.UPDATE, userMedias, user);

    return this.userMediaService.removeMultipleMediaFromAlbum(body);
  }

  @Post('/delete')
  @Acl({ microservice: 'studio', action: AclActionsEnum.delete })
  public async deleteMany(
    @ParamModel('businessId', BusinessSchemaName) business: BusinessModel,
    @User() user: AccessTokenPayload,
    @Body() body: IdsDto,
  ): Promise<void> {
    const userMedias: UserMediaModel[] = await this.userMediaService.findByIds(body);
    await this.denyAccessUnlessGranted(UserMediasRemoveVoter.REMOVE, userMedias, user);

    await this.userMediaService.deleteMany(body);
  }
}
