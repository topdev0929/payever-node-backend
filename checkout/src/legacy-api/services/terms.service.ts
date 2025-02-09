import { Injectable } from '@nestjs/common';
import { TermsInterface } from '../interfaces';
import { ApiCallSuccessDto, HeadersHolderDto, TermsFilterRequestDto } from '../dto';
import { TermsConfig } from '../config';
import { LegacyApiResponseTransformerService } from './legacy-api-response-transformer.service';
import { TranslationService } from '@pe/translations-sdk';
import { ExternalApiExecutor } from './external-api.executor';
import { ConnectionModel } from '../../connection';
import { PaymentMethodMigrationMappingModel, PaymentMethodMigrationMappingService } from '../../common';

const DEFAULT_LOCALE: string = 'en';

@Injectable()
export class TermsService {
  constructor(
    private readonly translationService: TranslationService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly paymentMethodMigrationMappingService: PaymentMethodMigrationMappingService,
  ) { }

  public async getTermsForPaymentMethodAndFilter(
    paymentMethod: string,
    filterDto: TermsFilterRequestDto,
    headersHolder: HeadersHolderDto,
    businessId: string,
    connection?: ConnectionModel,
  ): Promise<ApiCallSuccessDto> {
    const enabledMapping: PaymentMethodMigrationMappingModel =
      await this.paymentMethodMigrationMappingService.findEnabledPaymentMethodMapping(
        paymentMethod,
        businessId,
      );

    if (enabledMapping) {
      paymentMethod = enabledMapping.paymentMethodTo;
    }

    const paymentMethodTerms: TermsInterface[] = TermsConfig.get(paymentMethod);
    if (!paymentMethodTerms || !paymentMethodTerms.length) {
      return this.prepareTerms(null, DEFAULT_LOCALE, headersHolder, businessId, paymentMethod);
    }
    const defaultTerms: TermsInterface = paymentMethodTerms.find((terms: TermsInterface) => terms.default);
    const filteredTerms: TermsInterface = await this.filterTerms(paymentMethodTerms, filterDto);

    return this.prepareTerms(
      filteredTerms || defaultTerms,
      filterDto.locale || DEFAULT_LOCALE,
      headersHolder,
      businessId,
      paymentMethod,
      connection,
    );
  }

  private async filterTerms(
    paymentMethodTerms: TermsInterface[],
    filterDto: TermsFilterRequestDto,
  ): Promise<TermsInterface> {
    const filteredTerms: TermsInterface = null;
    if (!filterDto.channel) {
      return filteredTerms;
    }

    const channel: string = filterDto.channel.name;
    const channelType: string = filterDto.channel.type;
    if (channel && channelType) {
      return paymentMethodTerms.find(
        (terms: TermsInterface) => terms.channel === channel && terms.channel_type === channelType,
      );
    }

    if (channel) {
      return paymentMethodTerms.find(
        (terms: TermsInterface) => terms.channel === channel,
      );
    }

    return filteredTerms;
  }

  private async prepareTerms(
    terms: TermsInterface,
    locale: string,
    headersHolder: HeadersHolderDto,
    businessId: string,
    paymentMethod: string,
    connection?: ConnectionModel,
  ): Promise<ApiCallSuccessDto> {
    if (terms?.legal_text) {
      terms.legal_text = await this.translationService.getTranslation(terms.legal_text, locale);
    }

    if (terms?.form && terms.form.length) {
      for (const field of terms.form) {
        field.field_text = await this.translationService.getTranslation(field.field_text, locale);
        field.field_name = await this.translationService.getTranslation(field.field_name, locale);
      }
    }

    const externalTerms: any = terms?.hasRemoteTerms
      ? await this.externalApiExecutor.externalTerms(headersHolder, businessId, paymentMethod, connection)
      : null;

    return this.responseTransformer.successTermsResponse(terms, externalTerms);
  }
}
