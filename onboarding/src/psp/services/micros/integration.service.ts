/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable, HttpException } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseService } from './base.service';
import * as qs from 'qs';
import { environment } from '../../../environments';
import { OnboardingRequestTypeEnum } from '../../enums';

interface QrGenerateFileInterface {
  url: string;
  background?: any;
  payeverLogo?: any;
  wording?: string;
  businessName?: string;
  avatarUrl?: string;
  id?: string;
}

type Handler = (type: string, data: any, businessId: string) => Promise<any>;

@Injectable()
export class IntegrationService extends BaseService {
  private handlers: {
    [key: string]: Handler;
  } = {
      qr: this.qr_handler,
    };

  public async configureIntegration(type: string, data: any, businessId: string): Promise<any> {
    const handler: Handler = this.handlers[type];
    if (handler) {
      return handler.call(
        this,
        data,
        businessId,
      );
    }

    return { };
  }

  private async qr_handler(data: any, businessId: string): Promise<any> {
    let id: string = '';
    let channelSetId: string = ''; 

    if (data.type === OnboardingRequestTypeEnum.pos) {
      const terminalRequest: Observable<AxiosResponse<any>> = await this.intercomService.get<any>(
        [
          environment.microservices.posUrl,
          `/api/business`,
          `/${businessId}`,
          `/terminal`,
        ].join(''),
      );

      const terminalResponse: AxiosResponse<any> = await terminalRequest.toPromise();

      let defaultTerminal: any = terminalResponse.data;
      if (Array.isArray(terminalResponse.data)) {
        defaultTerminal = terminalResponse.data?.find((terminal: any) => terminal.active);
      }

      id = defaultTerminal?._id;
      channelSetId = defaultTerminal?.channelSet;
    }

    if (data.type === OnboardingRequestTypeEnum.ecommerce) {
      const checkoutRequest: Observable<AxiosResponse<any>> = await this.intercomService.get<any>(
        [
          environment.microservices.checkoutUrl,
          `/api/business`,
          `/${businessId}`,
          `/checkout`,
        ].join(''),
      );

      const checkoutResponse: AxiosResponse<any> = await checkoutRequest.toPromise();
      const defaultCheckout = checkoutResponse.data?.find((checkout: any) => checkout.default);
      id = defaultCheckout?._id;

      const channelSetRequest: Observable<AxiosResponse<any>> = await this.intercomService.get<any>(
        [
          environment.microservices.checkoutUrl,
          `/api/business`,
          `/${businessId}`,
          `/channelSet`,
        ].join(''),
      );

      const channelSetResponse: AxiosResponse<any> = await channelSetRequest.toPromise();
      const linkChannelSet: any = channelSetResponse.data?.find((channelSet: any) => channelSet.type === 'link');
      channelSetId = linkChannelSet?.id;
    }

    if (!id || !channelSetId) {
      return { };
    }

    const url: string = [
      environment.microservices.checkoutCdnUrl,
      `/${data.business?.defaultLanguage || 'de' }`,
      `/pay/create-flow-from-qr/channel-set-id`,
      `/${channelSetId}`,
    ].join('');

    const payload: QrGenerateFileInterface = {
      avatarUrl: data.business?.logo,
      businessName: data.business?.name,
      id,
      url,
    };

    const response: Observable<AxiosResponse<any>> = await this.intercomService.get<any>(
      [
        environment.microservices.qrUrl,
        `/api/download/base64`,
        `?${qs.stringify(payload)}`,
      ].join(''),
    );

    return response.pipe(
      map((res: any) => {
        return {
          content_type: 'data:image/png;base64',
          data: res.data,
        };
      }),
      catchError((error: AxiosError) => {

        throw new HttpException(error.response.data.message, error.response.data.code);
      }),
    ).toPromise();
  }
}
