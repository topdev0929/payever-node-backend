import { HttpService, Injectable, Logger, PreconditionFailedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments';

@Injectable()
export class AuthClient {
  public constructor(
    protected readonly http: HttpService,
    protected readonly logger: Logger,
  ) { }

  public async issueGuestToken(
    userAgent: string,
    ipHash: string,
  ): Promise<any> {
    const url: string = `${environment.authMicroBaseUrl}/api/guest-token`;
    const requestData: { ipHash: string } = { ipHash };
    const headers: { } = {
      'Content-Type': 'application/json',
      'User-Agent': userAgent,
    };

    const response: Observable<AxiosResponse<any>> = this.http.request({
      data: requestData,
      headers,
      method: 'POST',
      url,
    });

    return response.pipe(
      map((res: any) => {
        return res?.data?.accessToken;
      }),
      catchError(async (error: AxiosError) => {
        this.logger.error({
          error: error.message,
          message: 'Failed to issue guest token',
          rawError: error.response?.data,
          url,
        });

        throw new PreconditionFailedException(
          `Failed to start checkout flow`,
        );
      }),
    ).toPromise();
  }
}
