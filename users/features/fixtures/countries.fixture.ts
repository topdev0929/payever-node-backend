import { CommonModelsNamesEnum } from '@pe/common-sdk';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

class CountriesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<CountriesFixture> = this.application.get(CommonModelsNamesEnum.CountryModel);

    await model.create({
      _id: 'RU',
      name: 'Russia',
    });

    await model.create({
      _id: 'DE',
      name: 'Germany',
    });
  }
}

export = CountriesFixture;