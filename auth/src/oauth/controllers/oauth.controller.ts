import { Controller, Get, HttpCode, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { Model } from 'mongoose';

import { OAuthRequestDto, OAuthResponseDto } from '../dto';
import { LoggingModel } from '../interfaces/logging.model';
import { OAuthService } from '../services';
import { FastifyRequestWithIpInterface } from '../../auth/interfaces';
import { ScopesEnum } from '../../common';

@Controller('oauth/v2')
@ApiTags('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly logger: Logger,
    @InjectModel('Logging') private readonly loggingModel: Model<LoggingModel>,
  ) { }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: OAuthResponseDto, description: 'Token generated.' })
  public async getToken(@Req() request: FastifyRequestWithIpInterface): Promise<OAuthResponseDto> {
    const dto: OAuthRequestDto = await this.getOauthRequestDto(request);

    await this.loggingModel.create({
      log: JSON.stringify({
        dto: dto,
        method: 'POST',
        query: request.query,
      }),
    });

    return this.oauthService.getToken(dto, request);
  }

  @Get('token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: OAuthResponseDto, description: 'Token generated.' })
  public async getTokenFromQuery(@Req() request: FastifyRequestWithIpInterface): Promise<OAuthResponseDto> {
    await this.loggingModel.create({
      log: JSON.stringify({
        method: 'GET',
        query: request.query,
      }),
    });

    return this.oauthService.getToken(
      {
        client_id: request.query.client_id,
        client_secret: request.query.client_secret,
        grant_type: request.query.grant_type,
        scope: request.query.scope,
      },
      request,
    );
  }

  private async fromMultiPart(req: FastifyRequestWithIpInterface): Promise<OAuthRequestDto | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return new Promise(async (resolve: (dto?: OAuthRequestDto) => any, reject: (err: Error) => any): Promise<any> => {
      try {
        const dto: OAuthRequestDto = new OAuthRequestDto();

        for (const key in req.body) {
          if (req.body[key]) {
            dto[key] = typeof req.body[key] === 'object' ? req.body[key].value : req.body[key];
          }
        }

        resolve(dto);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async getOauthRequestDto(req: FastifyRequestWithIpInterface): Promise<OAuthRequestDto | undefined> {
    try {
      const multipart: OAuthRequestDto = await this.fromMultiPart(req);
      if (multipart) {
        return multipart;
      }
    } catch (e) {
      this.logger.log('Error while trying to parse multipart: ', e);
    }

    return plainToClass(OAuthRequestDto, req.body);
  }
}
