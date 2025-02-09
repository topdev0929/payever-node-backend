import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as cron from 'node-cron';
import * as parser from 'xml2json';
import { CommonModelsNamesEnum, CurrencyModel, CurrencyService } from '@pe/common-sdk';
import { CommonDataEventProducer } from '../producer';

@Injectable()
export class CurrencyUpdaterCron implements OnModuleInit {

  constructor(
    private readonly dataService: CurrencyService,
    private readonly commonDataEventProducer: CommonDataEventProducer,
    private readonly logger: Logger,
  ) { }

  public async onModuleInit(): Promise<void> {
    await cron.schedule('0 * * * *', () => this.updateCurrencies());
    this.logger.log('Configured cron schedule.');
  }

  public async updateCurrencies(): Promise<void> {
    this.logger.log('updating currencies...');

    try {
      const currencies: Array<{ currency: string; rate: string }> = await this.getCurrenciesRates();
      currencies.push({
        currency: 'EUR',
        rate: '1',
      });

      const promises: Array<Promise<CurrencyModel>> = currencies.map(
        (item: { currency: string; rate: string }) => {
          this.logger.log('Updating ' + item.currency);

          return this.dataService.updateRate(
            item.currency,
            Number(item.rate),
          );
        },
      );

      const currencyModels: CurrencyModel[] = await Promise.all(promises);

      this.logger.log('Successfully finished currencies update');

      await this.produceUpdatedEvents(currencyModels);
    } catch (e) {
      this.logger.log(e.toString());
    }
  }

  private async getCurrenciesRates(): Promise<Array<{ currency: string; rate: string }>> {
    const url: string = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml';

    return axios({ url })
      .then((response: AxiosResponse) => {
        const data: any = parser.toJson(response.data, { object: true });

        return data['gesmes:Envelope'].Cube.Cube.Cube;
      });
  }

  private async produceUpdatedEvents(currencyModels: CurrencyModel[]): Promise<void> {
    const sendingPromises: Array<Promise<void>> = [];
    for (const currencyModel of currencyModels) {
      sendingPromises.push(
        this.commonDataEventProducer.produceUpdateEvent(
          CommonModelsNamesEnum.CurrencyModel,
          currencyModel,
        ),
      );
    }

    await Promise.all(sendingPromises);
  }
}
