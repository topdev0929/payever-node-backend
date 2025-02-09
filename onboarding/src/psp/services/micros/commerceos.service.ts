import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';


import { BaseService } from './base.service';
import { TokenResultDto } from '../../dto';
import { RpcRabbitEventsEnum } from '../../enums';
import { environment } from '../../../environments';

const APPS: any[] = [
  {
    app: '1112a982-7ad4-4b03-8d53-874797f1c795',
    code: 'affiliates',
    installed: true,
    order: 40,
  },
  {
    app: '79cee30b-92a7-4796-a152-6303a4117d7f',
    code: 'checkout',
    installed: true,
    order: 50,
  },
  {
    app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
    code: 'connect',
    installed: true,
  },
  {
    app: '954fbf2f-5cb0-472c-8582-130ca23b7f7d',
    code: 'pos',
    installed: true,
  },
  {
    app: '0b923041-e8f1-4531-9430-d2d593043e29',
    code: 'message',
    installed: true,
    order: 130,
  },
  {
    app: 'c4094635-0f1d-42ed-b059-9a5a0dc9b5bb',
    code: 'products',
    installed: true,
    order: 30,
  },
  {
    app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
    code: 'settings',
    installed: true,
    order: 20,
  },
  {
    app: '51cce2bb-5a89-4442-a1cc-c6eed25c614a',
    code: 'shop',
    installed: true,
    order: 90,
  },
  {
    app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
    code: 'transactions',
    installed: true,
    order: 10,
    setupStatus: 'completed',
    stepStatus: 'completed',
  },
];

@Injectable()
export class CommerceOSService extends BaseService {

  public async installDefaultAppsRPC(businessId: string, userId: string): Promise<void> {
    const payload: any = {
      apps: APPS,
      businessId,
      userId,
    };

    await this.sendRPCCall(
      RpcRabbitEventsEnum.CommerceOSRpcInstallOnboardingApps,
      payload,
    );
  }

  public async installDefaultApps(
    businessId: string,
    axiosConfig: any,
  ): Promise<any> {
    const request: Observable<AxiosResponse<TokenResultDto>> = this.httpService.patch<any>(
      `${environment.microservices.commerceosUrl}/api/apps/business/${businessId}/toggle-installed`,
      {
        apps: [
          {
            app: '1112a982-7ad4-4b03-8d53-874797f1c795',
            code: 'affiliates',
            installed: true,
            order: 40,
          },
          {
            app: '79cee30b-92a7-4796-a152-6303a4117d7f',
            code: 'checkout',
            installed: true,
            order: 50,
          },
          {
            app: 'c1c70ee9-61d3-41b4-8b01-cd753a7fc202',
            code: 'connect',
            installed: true,
          },
          {
            app: '0b923041-e8f1-4531-9430-d2d593043e29',
            code: 'message',
            installed: true,
            order: 130,
          },
          {
            app: 'c4094635-0f1d-42ed-b059-9a5a0dc9b5bb',
            code: 'products',
            installed: true,
            order: 30,
          },
          {
            app: '252cfe31-f217-4fb6-a0ab-eea7161ade0f',
            code: 'settings',
            installed: true,
            order: 20,
          },
          {
            app: '51cce2bb-5a89-4442-a1cc-c6eed25c614a',
            code: 'shop',
            installed: true,
            order: 90,
          },
          {
            app: 'e0504b4c-8852-49d3-9996-ddfdfec7fc39',
            code: 'transactions',
            installed: true,
            order: 10,
            setupStatus: 'completed',
            stepStatus: 'completed',
          },
        ],
      },
      this.getAxiosRequestConfig(axiosConfig),
    );
    const response: AxiosResponse<any> = await request.toPromise();

    return response.data;
  }
}
