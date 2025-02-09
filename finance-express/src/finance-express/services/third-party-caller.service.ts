import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IntercomService } from '@pe/nest-kit';
import { AxiosError, AxiosResponse, Method } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServiceUrlRetriever } from './';
import { CalculateRatesDto } from '../dto';
import { ExtendedDataActionEnum, PaymentOptionsEnum } from '../enums';

@Injectable()
export class ThirdPartyCallerService {

  private readonly thirdPartyPaymentsMicroUrl: string;
  private readonly method: Method;
  constructor(
    private readonly httpService: IntercomService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly serviceUrlRetriever: ServiceUrlRetriever,
  ) {
    this.thirdPartyPaymentsMicroUrl =
      this.configService.get<string>('MICRO_URL_THIRD_PARTY_PAYMENTS') + '/api' +
      '/business/:businessId/connection/:connectionId/action';
    this.method = 'POST';
  }

  public async getRates(
    businessId: string,
    calculateRates: CalculateRatesDto,
  ): Promise<any> {
    let url: string = `${this.thirdPartyPaymentsMicroUrl}/${this.getAction(calculateRates.paymentOption)}`;
    url = this.serviceUrlRetriever.composeActionUrl(url, businessId, calculateRates);

    const response: Observable<AxiosResponse<any>> = await this.httpService.request({
      data: calculateRates,
      headers: { },
      method: this.method,
      url,
    });

    return response.pipe(
      map((res: any) => {
        return {
          credit: res.data,
          messages: { },
        };
      }),
      catchError((error: AxiosError) => {
        this.logger.error({
          data: calculateRates,
          error: error.response ? error.response.data : error.message,
          message: 'Failed response from third party payments service',
          url: url,
        });

        const errorMessage: string =
          error.response
            ? (error.response.data ? error.response.data.message : error.message)
            : error.message;

        throw new HttpException(errorMessage, HttpStatus.PRECONDITION_FAILED);
      }),
    ).toPromise();
  }


  private getAction(paymentOption: PaymentOptionsEnum): string {
    const extendedAction: string[] = Object.values(ExtendedDataActionEnum);

    return extendedAction.includes(paymentOption)
      ? 'extended-rates'
      : 'calculate-rates';
  }

}
