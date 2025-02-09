/* tslint:disable:no-identical-functions */
import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { PaymentAction } from '../../enum/payment-action.enum';
import { environment } from '../../environments';
import { TransactionsClientParameters } from '../../interfaces';

@Injectable()
export class TransactionsClient {
  private parameters: TransactionsClientParameters;

  constructor(private readonly logger: Logger) { }

  public init(parameters: TransactionsClientParameters): this {
    this.parameters = parameters;

    return this;
  }

  public async send(action: PaymentAction, data?: any): Promise<never | any> {
    if (!this.parameters) {
      throw new InternalServerErrorException(
        'A request to transactions microservice has been called before client initialization',
      );
    }

    const url: string = this.getTransactionsMicroserviceUrl(action);
    this.logger.log(`Running a transactions action '${action}'`);

    // TODO: refactor
    if (action === PaymentAction.list) {
      return axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${this.parameters.oauthToken}`,
            'User-Agent': this.parameters.userAgent,
          },
        })

        .catch((error: AxiosError) => {
          if (!error.response) {
            throw error;
          }

          throw new HttpException(error.response.data, error.response.status);
        });
    }

    return axios
      .post(url, data ? data : { }, {
        headers: {
          Authorization: `Bearer ${this.parameters.oauthToken}`,
          'User-Agent': this.parameters.userAgent,
        },
      })

      .catch((error: AxiosError) => {
        if (!error.response) {
          throw error;
        }

        throw new HttpException(error.response.data, error.response.status);
      });
  }

  private getTransactionsMicroserviceUrl(action: PaymentAction): string {
    if (action === 'action.list') {
      return (
        environment.transactionsUrl +
        `/api/business/${this.parameters.businessId}/detail/${
          this.parameters.paymentUuid
        }`
      );
    }

    return (
      environment.transactionsUrl +
      `/api/business/${this.parameters.businessId}/${
        this.parameters.paymentUuid
      }/action/${action}`
    );
  }
}
