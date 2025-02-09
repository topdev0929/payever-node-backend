import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { ProductService } from '../services';
import { BusinessService } from '../../business/services';
import { TaxModel, TaxService } from '@pe/common-sdk';
import { BusinessModel } from '../../business/models';

@Injectable()
export class FillStandardVatRatesForCountryCommand {
  constructor(
    private readonly productService: ProductService,
    private readonly businessService: BusinessService,
    private readonly taxService: TaxService,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'product:fill-standard-vat-rate <countryCode>', describe: 'Fills vat rates for all products by country' })
  public async fillStandardVat(
    @Positional({ name: 'countryCode' }) countryCode: string,
  ): Promise<void> {
    const tax: TaxModel = await this.getStandardTax(countryCode);

    if (!tax ) {
      return ;
    }

    const businesses: BusinessModel[] = await this.businessService.getListByCountry(countryCode);
    for (const business of businesses) {
      this.logger.log(`Filling "${tax.rate}" vat rates for business "${business.id}" products`);
      await this.productService.fillVatRatesForBusinessProducts(tax.rate, business.id);
    }
  }

  private async getStandardTax(countryCode: string): Promise<TaxModel> {
    const taxes: TaxModel[] = await this.taxService.findAllByCountry(countryCode);
    for (const tax of taxes) {
      if (tax.description === 'Standard VAT rate') {
        return tax;
      }
    }

    this.logger.error(`Standard VAT rate for country "${countryCode}" not found`);
  }
}
