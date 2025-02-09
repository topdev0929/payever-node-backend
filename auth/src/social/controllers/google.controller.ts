import { Controller, Get, UseGuards, Param, Res, HttpStatus, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequestWithIpInterface } from '../../auth/interfaces';
import { FastifyResponse } from '../../common/interfaces';

import { SocialLoginService } from '../services';
import { SocialUserDto } from '../dtos';
import { SocialTypeEnum } from '../enums';

@Controller('/api/social/google')
@ApiTags('social')
@UseGuards(JwtAuthGuard)
@Roles(RolesEnum.anonymous)
export class GoogleController {
  constructor(private readonly googleService: SocialLoginService) { }

  @Get('login')
  @UseGuards(AuthGuard('google_login'))
  public async googleLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('register')
  @UseGuards(AuthGuard('google_register'))
  public async googleRegister(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('redirect/login')
  @UseGuards(AuthGuard('google_login'))
  public async googleLoginRedirect(
    @Req() request: FastifyRequestWithIpInterface & { user: SocialUserDto },
    @Res() response: FastifyResponse,
  ): Promise<any> {
    await this.googleService.auth(request.user, request, response, SocialTypeEnum.Google, 'login');
  }

  @Get('redirect/register')
  @UseGuards(AuthGuard('google_register'))
  public async googleRegisterRedirect(
    @Req() request: FastifyRequestWithIpInterface & { user: SocialUserDto },
    @Res() response: FastifyResponse,
  ): Promise<any> {
    await this.googleService.auth(request.user, request, response, SocialTypeEnum.Google, 'register');
  }
}
