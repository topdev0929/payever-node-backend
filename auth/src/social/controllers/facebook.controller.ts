import { Controller, Get, UseGuards, Param, Res, HttpStatus, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequestWithIpInterface } from '../../auth/interfaces';
import { FastifyResponse } from '../../common/interfaces';

import { SocialLoginService } from '../services';
import { SocialUserDto } from '../dtos';
import { SocialTypeEnum } from '../enums';

@Controller('/api/social/facebook')
@ApiTags('social')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
export class FacebookController {
  constructor(private readonly facebookService: SocialLoginService) { }

  @Get('login')
  @UseGuards(AuthGuard('facebook_login'))
  public async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('register')
  @UseGuards(AuthGuard('facebook_register'))
  public async facebookRegister(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('redirect/login')
  @UseGuards(AuthGuard('facebook_login'))
  public async facebookLoginRedirect(
    @Req() request: FastifyRequestWithIpInterface & { user: SocialUserDto },
    @Res() response: FastifyResponse,
  ): Promise<any> {
    await this.facebookService.auth(request.user, request, response, SocialTypeEnum.Facebook, 'login');
  }

  @Get('redirect/register')
  @UseGuards(AuthGuard('facebook_register'))
  public async facebookRegisterRedirect(
    @Req() request: FastifyRequestWithIpInterface & { user: SocialUserDto },
    @Res() response: FastifyResponse,
  ): Promise<any> {
    await this.facebookService.auth(request.user, request, response, SocialTypeEnum.Facebook, 'register');
  }
}
