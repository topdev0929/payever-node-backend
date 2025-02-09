import { HttpService, Injectable, Logger, PreconditionFailedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments';
import { RedisClient } from '@pe/nest-kit';
import { JwtService } from '@nestjs/jwt';

const REDIS_EX_TIME = 24 * 60 * 60;

@Injectable()
export class AuthClientService {
  public constructor(
    protected readonly http: HttpService,
    protected readonly logger: Logger,
    protected readonly redisClient: RedisClient,
    private readonly jwt: JwtService,

  ) { }

  public generateRedisKey(key: string): string {
    return `live-chat:token:${key}`;
  }

  public async getGuestToken(
    userAgent: string,
    visitorHash: string,
  ): Promise<any> {

    const tokenCached = await this.readFromCache(visitorHash);
    if (tokenCached) {
      return tokenCached;
    }

    const url: string = `${environment.authMicroBaseUrl}/api/guest-token`;
    const requestData: { ipHash: string } = { ipHash: visitorHash };
    const headers: { } = {
      'Content-Type': 'application/json',
      'User-Agent': userAgent || '',
    };

    const response: Observable<AxiosResponse<any>> = this.http.request({
      data: requestData,
      headers,
      method: 'POST',
      url,
    });

    return response.pipe(
      map((res: any) => {
        return res?.data;
      }),
      tap((data) => {        
        if (!data.accessToken) {
          throw new PreconditionFailedException(
            `Failed to get guest token`,
          );
        }
        this.redisClient.getClient().set(
          this.generateRedisKey(visitorHash),
          data.accessToken,
          'EX',
          REDIS_EX_TIME,
        );
      }),
      catchError(async (error: AxiosError) => {
        this.logger.error({
          error: error.message,
          message: 'Failed to issue guest token',
          rawError: error.response?.data,
          url,
        });

        throw new PreconditionFailedException(
          `Failed to get guest token`,
        );
      }),
    ).toPromise();

  }

  private async readFromCache(visitorHash: string): Promise<any> {
    try {
      const token = await this.redisClient.getClient().get(this.generateRedisKey(visitorHash));

      if (!token) {
        return null;
      }

      const decodedData = await this.jwt.verifyAsync(token);
      
      const verifyToken = await this.redisClient.getClient().get(decodedData?.user?.tokenId);

      if (!verifyToken) {
        return null;
      }
      
      return {
        accessToken: token,
      };
      
    } catch (error) {
      return null;
    }
  }
}
