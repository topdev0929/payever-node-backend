import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { environment } from '../../environments';
import { TaskProcessor } from '../decorators/task.processor';
import { RabbitBinding, TaskType } from '../enums';
import { TaskModel } from '../models';
import { AbstractProcessor } from './abstract.processor';
import { PreloadMediaProcessor } from './preload-media.processor';
import { ReportDetailDocument } from '../schemas';
import { isMatch } from 'lodash';
import { ValidateInstructionResultDataInterface } from '../interfaces';

export enum CheckoutSection {
  Order = 'order',
  User = 'user',
  Address = 'address',
  Payment = 'payment',
  ChoosePayment = 'choosePayment',
  SendToDevice = 'send_to_device',
  Shipping = 'shipping',
  Coupons = 'coupons'
}
export interface CheckoutSectionInterface {
  code: CheckoutSection;
  order?: number;
  enabled?: boolean;
}
export interface CheckoutInterface {
  businessId: string;
  default: boolean;
  logo?: string;
  name: string;

  sections?: CheckoutSectionInterface[];
  settings?: any;
}

  /* TODO: add all integrations */
  const wellKnownCheckoutIntegrations: string[] = ['qr', 'twilio'];

  const sections: any = [
    {
      _id: '87695a9d-ab32-4fa5-b958-cf637eb6340a',
      code: CheckoutSection.Order,
      enabled: true,
      order: 0,
    },
    {
      _id: 'aaa84f89-e4b9-47f9-80f9-decf697294ea',
      code: CheckoutSection.ChoosePayment,
      enabled: true,
      order: 1,
    },
    {
      _id: '67b70735-bd5c-4894-b17f-1e9e8a7a1515',
      code: CheckoutSection.Address,
      enabled: true,
      order: 2,
    },
    {
      _id: 'dc558619-fa10-4baf-978b-b2c33b1deb82',
      code: CheckoutSection.Payment,
      enabled: true,
      order: 3,
    },
    {
      _id: 'b16ebb03-20f2-4517-a97b-41de5086f96a',
      code: CheckoutSection.Coupons,
      enabled: false,
      order: 4,
    },
    {
      _id: '939dfaa7-908e-478a-bc68-1018da075eb6',
      code: CheckoutSection.User,
      enabled: false,
      order: 5,
    },
  ];

@Injectable()
@TaskProcessor(TaskType.Checkout)
export class CheckoutProcessor extends AbstractProcessor {
  protected required: string[] = [
    TaskType.Apps,
    TaskType.Business,
    TaskType.Connect,
    TaskType.PreloadMedia,
  ];

  public async runInstruction(task: TaskModel): Promise<any> {
    await this.createCheckout(task);
  }

  public async revertInstruction(task: TaskModel): Promise<any> { }
  public async validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<ValidateInstructionResultDataInterface> {

    const defaultCheckout: AxiosResponse<CheckoutInterface[]> = 
    await this.httpService.get<CheckoutInterface[]>(
      [
        environment.microservices.checkoutUrl,
        `/api/business/${task.businessId}/checkout`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const connections: AxiosResponse<Array<{ integration: string}>> = 
    await this.httpService.get<Array<{ integration: string}>>(
      [
        environment.microservices.checkoutUrl,
        `/api/business/${task.businessId}/connection`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const expected: any = {
      connections: wellKnownCheckoutIntegrations,
      logo: !!task.incomingData.checkout.logo,
    };

    const actual: any = {
      connections: connections.data.map((connection: any) => connection.integration),
      logo: !!defaultCheckout.data[0].logo,
    };

    return {
      actual,
      expected,
      valid: isMatch(actual, expected),
    };
  }

  private async createCheckout(task: TaskModel): Promise<void> {

    const checkoutLogo: string = task.resultData[PreloadMediaProcessor.name]?.result?.checkoutLogo;

    let updateSections: {
      sections?: Array<{
        code: string;
        enabled: boolean;
        order: number;
        _id: string;
      }>;
    } = { };

    if (task.incomingData.checkout.sections?.preset === 'pos') {
      updateSections = {
        sections,
      };
    }

    const updateCheckoutPayload: any = {
      logo: checkoutLogo ? `${environment.microservices.customStorage}/images/${checkoutLogo}` : null,
      settings: task.incomingData.checkout.settings,
      ...updateSections,
    };

    const integrationsToInstall: string[] = task.incomingData.connect?.install?.filter(
      (integration: string) => wellKnownCheckoutIntegrations.includes(integration),
    ) || [];

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupCheckout,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupCheckout,
        payload: { 
          businessId: task.businessId, 
          integrationsToInstall,
          updateData: updateCheckoutPayload,
         },
      },
    );

  }
}
