import { BusinessService, CountryInfoService } from '../services';
import { Command } from '@pe/nest-kit';
import { BusinessModel } from '../models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FillDefaultLanguageForBusinessCommand {
  constructor(
    private readonly countryInfoService: CountryInfoService,
    private readonly businessService: BusinessService,
  ) { }

  @Command({ command: 'business:fill-default-language', describe: 'Fills default language for businesses' })
  public async fillDefaultLanguage(): Promise<void> {
    const limit: number = 100;
    let skip: number = 0;

    while (true) {
      const businesses: BusinessModel[] = await this.businessService.getList({ }, limit, skip);
      if (!businesses.length) {
        break;
      }

      for (const business of businesses) {
        await business.populate('businessDetail').execPopulate();

        if (business.businessDetail.companyAddress && business.businessDetail.companyAddress.country) {
          await this.businessService.updateBusiness(
            business,
            {
              $set: {
                defaultLanguage:
                  this.countryInfoService.getCountryLanguage(business.businessDetail.companyAddress.country),
              },
            },
          );
        }
      }

      skip += limit;
    }
  }
}
