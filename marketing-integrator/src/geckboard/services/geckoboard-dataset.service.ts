import { Injectable, HttpService } from '@nestjs/common';
import { AxiosResponse, AxiosError } from 'axios';
import { DatasetSchemaInterface } from '../interfaces';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { DatasetNameEnum } from '../enum';
import * as moment from 'moment';

@Injectable()
export class GeckoboardDatasetService {
  constructor(
    private readonly apiKey: string,
    private readonly httpService: HttpService,
  ) {
  }

  public async trackTransaction(amount: number, country: string): Promise<void> {
    const date: string = moment().toISOString();

    await this.pushDatasetRecords(DatasetNameEnum.TransactionsByCountry, [{
      amount: Number(amount) * 100,
      country,
      date,
    }]);
  }

  public async createDataset(datasetName: string, schema: DatasetSchemaInterface): Promise<any> {
    return this.httpService.put(
      `${this.getBaseApiUrl()}/${datasetName}`,
      schema,
    ).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((err: AxiosError, caught: Observable<any>) => {
        return throwError(
          new Error(`Error creating dataset - ${err.message}: ${err.response && JSON.stringify(err.response.data)}`),
        );
      }),
    ).toPromise();
  }

  public async deleteDataset(datasetName: string): Promise<any> {
    return this.httpService.delete(
      `${this.getBaseApiUrl()}/${datasetName}`,
    ).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((err: AxiosError, caught: Observable<any>) => {
        return throwError(
          new Error(`Error deleting dataset - ${err.message}: ${err.response && JSON.stringify(err.response.data)}`),
        );
      }),
    ).toPromise();
  }

  public async pushDatasetRecords(datasetName: string, records: any[]): Promise<any> {
    return this.httpService.post(
      `${this.getBaseApiUrl()}/${datasetName}/data`,
      { data: records },
    ).pipe(
      map((response: AxiosResponse) => response.data),
      catchError((err: AxiosError, caught: Observable<any>) => {
        return throwError(
          new Error(
            `Error adding dataset record - ${err.message}: ${err.response && JSON.stringify(err.response.data)}`,
          ),
        );
      }),
    ).toPromise();
  }

  public async clearDatasetRecords(datasetName: string): Promise<any> {
    return this.pushDatasetRecords(datasetName, []);
  }

  private getBaseApiUrl(): string {
    return `https://${this.apiKey}:@api.geckoboard.com/datasets`;
  }
}
