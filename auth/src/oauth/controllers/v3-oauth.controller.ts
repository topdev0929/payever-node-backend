import { Controller, Get, HttpCode, HttpStatus, Logger, Post, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Model } from 'mongoose';

import { V3OAuthRequestDto, V3OAuthResponseDto } from '../dto';
import { LoggingModel } from '../interfaces/logging.model';
import { OAuthService } from '../services';
import { V3FastifyRequestWithIpInterface } from '../../auth/interfaces';
import { ScopesEnum } from '../../common';

@Controller('oauth/v3')
@ApiTags('oauth')
export class V3OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly logger: Logger,
    @InjectModel('Logging') private readonly loggingModel: Model<LoggingModel>,
  ) { }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: V3OAuthResponseDto, description: 'Token generated.' })
  public async getToken(@Req() request: V3FastifyRequestWithIpInterface): Promise<V3OAuthResponseDto> {
    const dto: V3OAuthRequestDto = await this.getOauthRequestDto(request);

    await this.loggingModel.create({
      log: JSON.stringify({
        dto: dto,
        method: 'POST',
        query: request.query,
      }),
    });

    return this.oauthService.getTokenV3(dto, request);
  }

  @Get('token')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: V3OAuthResponseDto, description: 'Token generated.' })
  public async getTokenFromQuery(@Req() request: V3FastifyRequestWithIpInterface): Promise<V3OAuthResponseDto> {
    await this.loggingModel.create({
      log: JSON.stringify({
        method: 'GET',
        query: request.query,
      }),
    });

    return this.oauthService.getTokenV3(
      {
        business_id: request.query.business_id,
        client_id: request.query.client_id,
        client_secret: request.query.client_secret,
        grant_type: request.query.grant_type,
        scopes: this.formatScopes(request.query.scopes),
      },
      request,
    );
  }

  private formatScopes(scopes?: ScopesEnum[]): ScopesEnum[] {
    if (!scopes) {
      return [];
    }

    if (!Array.isArray(scopes)) {
      return [scopes];
    }

    return scopes;
  }

  private async fromMultiPart(req: V3FastifyRequestWithIpInterface): Promise<V3OAuthRequestDto | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return new Promise(async (resolve: (dto?: V3OAuthRequestDto) => any, reject: (err: Error) => any): Promise<any> => {
      try {
        const dto: V3OAuthRequestDto = new V3OAuthRequestDto();

        for (const key in req.body) {
          if (req.body[key]) {
            dto[key] = typeof req.body[key] === 'object' && !Array.isArray(req.body[key])
              ? req.body[key].value
              : req.body[key];
          }
        }

        resolve(dto);
      } catch (err) {
        reject(err);
      }
    });
  }

  private async getOauthRequestDto(req: V3FastifyRequestWithIpInterface): Promise<V3OAuthRequestDto | undefined> {
    try {
      const multipart: V3OAuthRequestDto = await this.fromMultiPart(req);
      if (multipart) {
        return multipart;
      }
    } catch (e) {
      this.logger.log('Error while trying to parse multipart: ', e);
    }

    return plainToClass(V3OAuthRequestDto, req.body);
  }
}
