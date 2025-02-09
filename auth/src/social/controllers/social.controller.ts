import { Controller, Get, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum, User, UserTokenInterface, AbstractController } from '@pe/nest-kit';

import { SocialLoginService } from '../services';
import { SocialUpdateVoter, SocialDeleteVoter } from '../voters';
import { SocialModel } from '../models';

@Controller('/api/social')
@ApiTags('social')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.user)
export class SocialController extends AbstractController {
  constructor(private readonly socialService: SocialLoginService) {
    super();
  }

  @Get('accounts')
  public async getAllUserAccounts(
    @User() user: UserTokenInterface,
  ): Promise<SocialModel[]> {
    return this.socialService.getAllUserAccounts(user.id);
  }

  @Delete('accounts/:socialId')
  public async deleteSocialAccount(
    @Param('socialId') socialId: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(SocialDeleteVoter.DELETE, socialId, user);
    await this.socialService.deleteSocialAccount(socialId);
  }

  @Patch('accounts/:socialId/block')
  public async blockSocialAccount(
    @Param('socialId') socialId: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(SocialUpdateVoter.UPDATE, socialId, user);
    await this.socialService.blockSocialAccount(socialId);
  }

  @Patch('accounts/:socialId/unblock')
  public async unblockSocialAccount(
    @Param('socialId') socialId: string,
    @User() user: UserTokenInterface,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(SocialUpdateVoter.UPDATE, socialId, user);
    await this.socialService.unblockSocialAccount(socialId);
  }
}
