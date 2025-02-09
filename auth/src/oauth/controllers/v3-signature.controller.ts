import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesEnum } from '@pe/nest-kit/modules/auth';

import {
  OAuthResponseDto,
  OAuthSignRequestDto,
  OAuthSignResponseDto,
  SignMessageInterface,
  V3OAuthResponseDto,
  V3OAuthSignTokenRequestDto,
} from '../dto';
import { OAuthClientSignAlgorythms } from '../enum';
import { OAuthService, SignatureService } from '../services';
import { OAuthClient } from '../interfaces';
import { V3FastifyRequestWithIpInterface } from '../../auth/interfaces';

@Controller('v3/oauth/sign')
@ApiTags('oauth-sign')
@UseGuards(JwtAuthGuard)
export class V3OAuthSignatureController {
  constructor(
    private readonly signatureService: SignatureService,
    private readonly oauthService: OAuthService,
  ) { }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: OAuthResponseDto, description: 'Token generated.' })
  @Roles(RolesEnum.anonymous)
  public async getTokenBySignedMessage(
    @Body() dto: V3OAuthSignTokenRequestDto,
    @Req() request: V3FastifyRequestWithIpInterface,
  ): Promise<V3OAuthResponseDto> {
    const client: OAuthClient = await this.oauthService.findOneById(dto.client_id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const algorythm: OAuthClientSignAlgorythms = OAuthClientSignAlgorythms[dto.hash_alg];
    if (algorythm === undefined) {
      throw new BadRequestException('Sign algorythm not supported');
    }

    const message: string = this.signatureService.substituteOauthParams(dto.message, client.secret);

    if (!this.signatureService.verify(algorythm, message, client.secret, dto.signature)) {
      throw new BadRequestException('Signature invalid');
    }

    return this.oauthService.getTokenV3(
      {
        business_id: dto.business_id,
        client_id: dto.client_id,
        client_secret: client.secret,
        grant_type: dto.grant_type,
        scopes: dto.scopes,
      },
      request,
    );
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  @Roles(RolesEnum.oauth)
  @ApiResponse({ status: HttpStatus.OK, type: OAuthResponseDto, description: 'Token generated.' })
  public async getMessagesSignature(@Body() dto: OAuthSignRequestDto): Promise<OAuthSignResponseDto> {
    const client: OAuthClient = await this.oauthService.findOneById(dto.client_id);
    if (!client) {
      throw new NotFoundException('Client not fount');
    }

    const algorythm: OAuthClientSignAlgorythms = OAuthClientSignAlgorythms[dto.hash_alg];
    if (algorythm === undefined) {
      throw new BadRequestException('Sign algorythm not supported');
    }

    return {
      messages: dto.messages.map((x: SignMessageInterface) => {
        return {
          id: x.id,
          signature: this.signatureService.sign(algorythm, x.value, client.secret),
        };
      }),
    };
  }
}
