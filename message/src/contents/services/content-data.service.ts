import { Injectable, HttpException, Logger } from '@nestjs/common';
import { AxiosResponse, AxiosError, Method } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IntercomService } from '@pe/nest-kit';
import { ContentModel } from '../models';
import { environment } from '../../environments';
import { BusinessLocalDocument as BusinessModel } from '../../projections/models';

@Injectable()
export class ContentDataService {
  constructor(
    private readonly http: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async findAllShops(business: BusinessModel): Promise<ContentModel[]> {
    return this.request(
      `${environment.other.shopUrl}/business/${business._id}/shop`,
      'get',
    );
  }

  private async request(url: string, method: Method): Promise<any> {
    this.logger.debug({
      context: 'ContentDataService.request',

      method,
      url,
    });

    const response: Observable<AxiosResponse<any>> =
      await this.http.request(
        {
          headers: { },
          method,
          url,
        },
      ) as any;

    return response.pipe(
      map((res: AxiosResponse<any>) => res.data),
      catchError((err: AxiosError) => {
        this.logger.error({
          context: 'ContentDataService.request',

          error: err,
          message: `request got an error`,
        });
        throw new HttpException(err.response.data, err.response.status);
      }),
    )
      .toPromise();
  }
}
