import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { FLOW_PAYMENT_METHODS_FILTER } from '../../constants';
import { FlowPaymentMethodsFilterInterface } from '../../interfaces';
import { FlowModel } from '../../models';
import { ConnectionModel } from '../../../connection/models';
import { ApiCallService } from '../../../common/services';
import { PaymentMethodInterface } from '../../../common/interfaces';
import { ApiCallModel } from '../../../common/models';

@Injectable()
@ServiceTag(FLOW_PAYMENT_METHODS_FILTER)
export class CountryFilter implements FlowPaymentMethodsFilterInterface {
  constructor(
    private readonly apiCallService: ApiCallService,
  ) { }

  public async filter(
    flow: FlowModel,
    enabledPaymentMethods: PaymentMethodInterface[],
    enabledConnections: ConnectionModel[],
  ): Promise<[PaymentMethodInterface[], ConnectionModel[]]> {
    const country: string = await this.guessCountry(flow);
    if (!country || flow.disableValidation) {
      return [enabledPaymentMethods, enabledConnections];
    }

    enabledPaymentMethods = enabledPaymentMethods.filter(
      (paymentMethod: PaymentMethodInterface) => paymentMethod.options.countries.includes(country.toUpperCase()),
    );

    enabledConnections = enabledConnections.filter(
      (connection: ConnectionModel) => {
        return !connection.options.countryLimits
          || !connection.options.countryLimits.length
          || connection.options.countryLimits.includes(country.toUpperCase());
      },
    );

    return [enabledPaymentMethods, enabledConnections];
  }

  private async guessCountry(flow: FlowModel): Promise<string> {
    const apiCall: ApiCallModel = flow.apiCallId ? await this.apiCallService.findApiCallById(flow.apiCallId) : null;

    return apiCall?.purchase_country
      || flow?.billingAddress?.country
      || flow?.shippingAddress?.country
      || apiCall?.country;
  }
}
