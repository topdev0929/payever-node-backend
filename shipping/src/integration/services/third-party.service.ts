import { HttpService, Injectable, HttpException } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments';
import { Observable } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';

const API_URL: string = environment.thirdPartyShippingMicroUrl;

@Injectable()
export class ThirdPartyService {
  constructor(
    private readonly httpService: HttpService,
  ) { }

  public async post(uri: string, data: { } = { }, headers: any): Promise<any> {
    const response: Observable<AxiosResponse> = this.httpService
      .post(
        this.composeUrl(uri),
        data,
        {
          headers,
        },
      );

    return response
      .pipe(
        map((res: AxiosResponse ) => res.data),
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .toPromise();
  }

  public async get(uri: string, headers?: any): Promise<any> {
    const response: Observable<AxiosResponse> = this.httpService
      .get(
        this.composeUrl(uri),
        {
          headers,
        },
      );

    return response
      .pipe(
        map((res: AxiosResponse ) => res.data),
        catchError((error: AxiosError) => {
          throw new HttpException(error.response.data, error.response.status);
        }),
      )
      .toPromise();
  }

  private composeUrl(uri: string): string {
    return `${API_URL}/api/${uri}`;
  }
}
