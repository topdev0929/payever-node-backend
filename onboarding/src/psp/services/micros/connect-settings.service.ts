/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable, HttpException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseService } from './base.service';
import { PaymentMethodDto } from '../../dto/onboarding/payment-method.dto';
import { RpcRabbitEventsEnum } from '../../enums';
import { QRTypeEnum } from '../../../onboarding/enums';
import { 
  SantanderPayloadInterface, 
  ConnectSettingsPayloadInterface, 
  ZiniaPayloadInterface, 
} from '../../../onboarding/interfaces/incoming';
import { environment } from '../../../environments';

interface ConnectionItem {
  authorizationId: string;
  name: string;
}

/**
 * @see device-payments/src/dto/settings.dto.ts
 */
interface DevicePaymentsSettingsRequestPayload {
  secondFactor: boolean;
  autoresponderEnabled: boolean;
  verificationType: number;
}

/**
 * @see qr/src/qr/dto/qrform-request.dto.ts
 */
interface QrSettingsRequestPayload {
  type: QRTypeEnum;
  displayAvatar?: boolean;
  url: string;
  businessName?: string;
  avatarUrl?: string;
  id?: string;
  background?: null;
  payeverLogo?: null;
  wording?: null;
  action: 'save';
}

interface TwilioConnectRequestPayload {
  accountSid: string;
  authToken: string;
  action: 'form-connect';
}

interface ZiniaConnectRequestPayload {
  action: 'form-connect';
  apiKey: string;
  channelId: string;
  integration: string;
  integrationCategory: 'payments';
  modalType: 'default';
  redirectUri: string;
}

interface SantanderInvoiceDeConnectRequestPayload {
  connectionName?: string;
  sender: string;
  login: string;
  password: string;
  channel: string;
  connections: ConnectionItem[];
  action: 'payment-form-connect';
}

interface SantanderInvoiceDeConnectResponsePayload {
  form: {
    actionContext: {
      id: string;
      connections: ConnectionItem[];
    };
  };
}

interface SantanderInvoiceDeSaveRequestPayload {
  id: string;
  connections: ConnectionItem[];
  shopRedirectEnabled: boolean;
  action: 'payment-form-save';
}

type Handler = (businessId: string, paymentMethod: any, appCode: string) => Promise<void>;

@Injectable()
export class ConnectSettingsService extends BaseService {
  private handlers: {
    [key in keyof ConnectSettingsPayloadInterface]: Handler;
  } = {
      'device-payments': this.devicePaymentsHandler,
      qr: this.qr_handler,
      santander_factoring_de: this.santander_handler,
      santander_invoice_de: this.santander_handler,
      santander_pos_factoring_de: this.santander_handler,
      santander_pos_invoice_de: this.santander_handler,
      twilio: this.twilio_handler,
      zinia_bnpl: this.zinia_handler,
      zinia_bnpl_de: this.zinia_handler,
      zinia_installment: this.zinia_handler,
      zinia_installment_de: this.zinia_handler,
      zinia_pos: this.zinia_handler,
      zinia_pos_de: this.zinia_handler,
      zinia_slice_three: this.zinia_handler,
    };

  public async configPaymentMethod(businessId: string, paymentMethod: PaymentMethodDto, data: any): Promise<any> {
    const handler: Handler = this.handlers[paymentMethod.type];
    if (handler) {
      return handler.call(
        this,
        businessId,
        paymentMethod,
        data,
      );
    }

    return { };
  }

  private async devicePaymentsHandler(businessId: string, paymentMethod: PaymentMethodDto, data: any): Promise<void> {
    if (Object.keys(paymentMethod.credentials).length === 0) {
      return;
    }
    const payload: DevicePaymentsSettingsRequestPayload = {
      autoresponderEnabled: paymentMethod.credentials.autoresponder_enabled,
      secondFactor: paymentMethod.credentials.second_factor,
      verificationType: paymentMethod.credentials.verification_type,
    };

    const response: Observable<AxiosResponse<any>> = await this.intercomService.put(
      [
        environment.microservices.devicePaymentsUrl,
        `/api/v1/${businessId}/settings`,
      ].join(''),
      payload,
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {

        throw new HttpException(error.response.data.message, error.response.data.code);
      }),
    ).toPromise();
  }

  private async qr_handler(businessId: string, paymentMethod: PaymentMethodDto, data: any): Promise<any> {
    if (Object.keys(paymentMethod.credentials).length === 0) {
      return;
    }

    const payload: QrSettingsRequestPayload = {
      action: 'save',
      businessName: data.business?.name,
      displayAvatar: paymentMethod.credentials.display_avatar,
      type: paymentMethod.credentials.type,
      url: environment.microservices.commerceosFrontendUrl,
    };

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post<any>(
      [
        environment.microservices.qrUrl,
        `/api/form/${businessId}/save`,
      ].join(''),
      payload,
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {

        throw new HttpException(error.response.data.message, error.response.data.code);
      }),
    ).toPromise();
  }

  private async twilio_handler(businessId: string, paymentMethod: PaymentMethodDto, data: any): Promise<void> {
    const payload: TwilioConnectRequestPayload = {
      accountSid: paymentMethod.credentials.account_sid,
      action: 'form-connect',
      authToken: paymentMethod.credentials.auth_token,
    };

    const response: Observable<AxiosResponse<any>> = await this.intercomService.post(
      [
        environment.microservices.communicationsThirdPartyUrl,
        `/api/business/${businessId}/integration/twilio/action/form-connect`,
      ].join(''),
      payload,
    );

    return response.pipe(
      map((res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {

        throw new HttpException(error.response.data.message, error.response.data.code);
      }),
    ).toPromise();
  }

  private async zinia_handler(businessId: string, paymentMethod: PaymentMethodDto, data: any): Promise<void> {
    let formResponse: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.ThirdPartyPaymentsRpcIntegrationForm,
      {
        businessId,
        integrationName: paymentMethod.type,
      },
    );
    formResponse = formResponse[0] as SantanderInvoiceDeConnectResponsePayload;

    const args: ZiniaPayloadInterface =
      _.mapKeys(paymentMethod.credentials, (v: any, k: string) => _.camelCase(k)) as ZiniaPayloadInterface;

    const formConnectPayload: ZiniaConnectRequestPayload = {
      ...args,
      ...formResponse.form.actionContext,
      action: 'form-connect',
      integration:  paymentMethod.type,
      integrationCategory: 'payments',
      modalType: 'default',
    };

    const formConnectResponse: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.ThirdPartyPaymentsRpcIntegrationAction,
      {
        action: 'form-connect',
        businessId,
        data: formConnectPayload,
        integrationName: paymentMethod.type,
      },
    );

    return formConnectResponse[0];
  }

  private async santander_handler(businessId: string, paymentMethod: PaymentMethodDto, data: any): Promise<void> {
    let formResponse: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.ThirdPartyPaymentsRpcIntegrationForm,
      {
        businessId,
        integrationName: paymentMethod.type,
      },
    );
    formResponse = formResponse[0] as SantanderInvoiceDeConnectResponsePayload;

    const args: SantanderPayloadInterface =
      _.mapKeys(paymentMethod.credentials, (v: any, k: string) => _.camelCase(k)) as SantanderPayloadInterface;
    const formConnectPayload: SantanderInvoiceDeConnectRequestPayload = {
      ...args,
      ...formResponse.form.actionContext,
      action: 'payment-form-connect',
    };

    let formConnectResponse: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.ThirdPartyPaymentsRpcIntegrationAction,
      {
        action: 'payment-form-connect',
        businessId,
        data: formConnectPayload,
        integrationName: paymentMethod.type,
      },
    );
    formConnectResponse = formConnectResponse[0] as SantanderInvoiceDeConnectResponsePayload;

    const savePayload: SantanderInvoiceDeSaveRequestPayload = {
      ...formConnectResponse.form.actionContext,
      action: 'payment-form-save',
      shopRedirectEnabled: false,
    };

    let paymentOptions: any = await this.sendRPCCall(
      RpcRabbitEventsEnum.ThirdPartyPaymentsRpcIntegrationAction,
      {
        action: 'payment-form-save',
        businessId,
        data: savePayload,
        integrationName: paymentMethod.type,
      },
    );
    paymentOptions = paymentOptions[0];

    return paymentOptions;
  }
}
