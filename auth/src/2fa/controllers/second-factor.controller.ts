import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokensResultModel, User } from '@pe/nest-kit';
import { FastifyResponse } from '../../common/interfaces/fastify-response.interface';

import { FastifyRequestWithIpInterface, RefreshPayload } from '../../auth/interfaces';
import { SecondFactorDto } from '../dto';
import { SecondFactorService } from '../services';
import { TokenCookieWriter } from '../../common';

const accessGrantedDescription: string = 'Access granted';
@Controller('api/2fa')
@ApiTags('2FA')
@UseGuards(AuthGuard('refresh'))
export class SecondFactorController {
  constructor(
    private readonly secondFactorService: SecondFactorService,
    private readonly tokenCookieWriter: TokenCookieWriter,
  ) { }

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh'))
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async auth(
    @User() refreshTokenPayload: RefreshPayload,
    @Body() dto: SecondFactorDto,
    @Req() request: FastifyRequestWithIpInterface,
    @Res() response: FastifyResponse,
  ): Promise<void> {
    const tokenObject: TokensResultModel = await this.secondFactorService.validate(
      refreshTokenPayload.payload.tokenId, dto.secondFactorCode, request,
    );
    this.tokenCookieWriter.setTokenToCookie(
      response,
      tokenObject,
    );
    response.status(HttpStatus.OK).send(tokenObject);
  }

  @Post('/resend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('refresh'))
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.OK, description: accessGrantedDescription })
  public async resend(@User() refreshTokenPayload: RefreshPayload): Promise<void> {
    return this.secondFactorService.resend(refreshTokenPayload.payload.tokenId, refreshTokenPayload.payload.language);
  }
}
