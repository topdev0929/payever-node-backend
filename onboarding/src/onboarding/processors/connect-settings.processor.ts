/* eslint-disable @typescript-eslint/unbound-method */
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { environment } from '../../environments';
import { TaskProcessor } from '../decorators/task.processor';
import { QRTypeEnum, RabbitBinding, TaskType } from '../enums';
import { SantanderPayloadInterface, ConnectSettingsPayloadInterface } from '../interfaces/incoming';
import { TaskModel } from '../models';
import { AbstractProcessor } from './abstract.processor';
import { ReportDetailDocument } from '../schemas';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';

const DEVICE_PAYMENTS_KEY: string = 'device-payments';
interface ConnectionItem {
  authorizationId: string;
  name: string;
}

interface ThirdPartyConnectionInterface {
  connected: boolean;
  name: string;
  integration: string;
  business: string;
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

interface SantanderInvoiceDeConnectRequestPayload {
  connectionName?: string;
  sender: string;
  login: string;
  password: string;
  channel: string;
  connections: ConnectionItem[];
  action: 'form-connect';
}

type Handler = (task: TaskModel, appCode: string) => Promise<void>;

@Injectable()
@TaskProcessor(TaskType.ConnectSettings)
export class ConnectSettingsProcessor extends AbstractProcessor {
  protected name: string = TaskType.ConnectSettings;
  protected required: string[] = [
    TaskType.Connect,
  ];
  private handlers: {
    [key in keyof ConnectSettingsPayloadInterface]: Handler;
  } = {
      [DEVICE_PAYMENTS_KEY]: this['device-payments_handler'],
      qr: this.qr_handler,
      santander_factoring_de: this.santander_handler,
      santander_invoice_de: this.santander_handler,
      santander_pos_factoring_de: this.santander_handler,
      santander_pos_installment: this.santander_pos_installment_handler,
      santander_pos_invoice_de: this.santander_handler,
      twilio: this.twilio_handler,
    };

  public async runInstruction(task: TaskModel): Promise<RunInstructionResult> {

    for (const connectAppCode of Object.keys(task.incomingData[TaskType.ConnectSettings])) {
      const handler: Handler = this.handlers[connectAppCode];
      if (handler) {
        await handler.call(this, task, connectAppCode);
      }
    }

    return { };
  }

  public async validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<ValidateInstructionResultDataInterface> {

    const communicationIntegrations: string[] = ['device-payments', 'qr', 'twilio'];
    const paymentIntegrations: string[] = ['santander_pos_installment'];

    const communicationConnections: string[] = await this.getConnectedIntegrations(
      environment.microservices.communicationsThirdPartyUrl, 
      communicationIntegrations,
      task,
    );

    const paymentConnections: string[] = await this.getConnectedIntegrations(
      environment.microservices.paymentThirdPartyUrl, 
      paymentIntegrations,
      task,
    );

    const expected: string[] = Object.keys(task.incomingData['connect-settings']);
    const actual: string[] = [...communicationConnections, ...paymentConnections];

    return {
      actual,
      expected,
      valid: expected.every((val: string) => actual.includes(val)),
    };
  }


  public async revertInstruction(task: TaskModel): Promise<void> { }

  private async getConnectedIntegrations(thirdPartyUrl: string, 
    integrations: string[], task: TaskModel): Promise<string[]> {
    const connectedIntegrations: string[] = [];

    for (const integration of integrations) {
      const connectionData: AxiosResponse<ThirdPartyConnectionInterface[]> = 
      await this.httpService.get<ThirdPartyConnectionInterface[]>(
        [
          thirdPartyUrl,
          `/api/business/${task.businessId}/connection/${integration}`,
        ].join(''),
        this.getAxiosRequestConfig(task),
      ).toPromise();

      if (connectionData.data.length && connectionData.data[0].connected) {
        connectedIntegrations.push(integration);
      }
    }

    return connectedIntegrations;
  }

  private async 'device-payments_handler'(task: TaskModel): Promise<void> {
    if (Object.keys(task.incomingData['connect-settings'][DEVICE_PAYMENTS_KEY]).length === 0) {
      return;
    }

    const payload: DevicePaymentsSettingsRequestPayload = {
      autoresponderEnabled: task.incomingData[TaskType.ConnectSettings][DEVICE_PAYMENTS_KEY].autoresponderEnabled,
      secondFactor: task.incomingData[TaskType.ConnectSettings][DEVICE_PAYMENTS_KEY].secondFactor,
      verificationType: task.incomingData[TaskType.ConnectSettings][DEVICE_PAYMENTS_KEY].verificationType,
    };

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupDevicePayments,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupDevicePayments,
        payload: {
          businessId: task.businessId,
          settingsData: payload,
        },
      },
    );
  }

  private async qr_handler(task: TaskModel): Promise<void> {

    if (Object.keys(task.incomingData['connect-settings'].qr).length === 0) {
      return;
    }
    const payload: QrSettingsRequestPayload = {
      action: 'save',
      businessName: task.incomingData.business.name,
      displayAvatar: task.incomingData[TaskType.ConnectSettings].qr.displayAvatar,
      type: task.incomingData[TaskType.ConnectSettings].qr.type,
      url: environment.microservices.commerceosFrontendUrl,
    };

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupQr,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupQr,
        payload: {
          businessId: task.businessId,
          settingsData: payload,
        },
      },
    );
  }

  private async twilio_handler(task: TaskModel): Promise<void> {
    const payload: TwilioConnectRequestPayload = {
      accountSid: task.incomingData[TaskType.ConnectSettings].twilio.accountSid,
      action: 'form-connect',
      authToken: task.incomingData[TaskType.ConnectSettings].twilio.authToken,
    };

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.ThirdPartyCommunicationPendingIntegrationAction,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.ThirdPartyCommunicationPendingIntegrationAction,
        payload: {
          action: 'form-connect',
          businessId: task.businessId,
          data: payload,
          integrationName: 'twilio',
        },
      },
    );
  }

  private async santander_pos_installment_handler(task: TaskModel, connectAppCode: string): Promise<void> {
    if (connectAppCode !== 'santander_pos_installment') {
      return;
    }

    const args: { vendorNumber: string; password: string } =
    task.incomingData[TaskType.ConnectSettings][connectAppCode];

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.ThirdPartyPaymentsPendingIntegrationAction,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.ThirdPartyPaymentsPendingIntegrationAction,
        payload: {
          action: 'payment-form-connect',
          businessId: task.businessId,
          data: args,
          includeFormListFields: true,
          integrationName: 'santander_pos_installment',
        },
      },
    );

  }

  private async santander_handler(task: TaskModel, connectAppCode: string): Promise<void> {
    const args: SantanderPayloadInterface = task.incomingData[TaskType.ConnectSettings][connectAppCode];
    const createConnectionPayload: SantanderInvoiceDeConnectRequestPayload = {
      ...args,
      action: 'form-connect',
      connections: [],
    };

    const response: any = await this.onboardingEventsProducer.sendRPCCall(
      {
        action: 'form-connect',
        businessId: task.businessId,
        data: createConnectionPayload,
        integrationName: connectAppCode,
      },
      RabbitBinding.RpcThirdPartyPaymentsIntegrationAction,
    );

    if (!response || !response.length) {
      return;
    }

    const actionContext: any = response[0]?.form?.actionContext;

    if (!actionContext) {
      return;
    }

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.ThirdPartyPaymentsPendingIntegrationAction,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.ThirdPartyPaymentsPendingIntegrationAction,
        payload: {
          action: 'payment-form-save',
          businessId: task.businessId,
          data: { 
            action: 'payment-form-save',
            shopRedirectEnabled: false,
            ...actionContext,
          },
          integrationName: 'santander_pos_installment',
        },
      },
    );
  }
}
