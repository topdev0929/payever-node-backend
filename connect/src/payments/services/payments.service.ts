import { Injectable, HttpService, BadRequestException, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { BusinessModelLocal } from '../../business';
import {
  IntegrationModel,
  IntegrationSubscriptionService,
  IntegrationSubscriptionModel,
} from '../../integration';
import { PaymentPayloadInterface, PaymentMailInterface, PaymentDocumentPayloadInterface } from '../interfaces';
import { PaymentMailSentDto, UpdatePaymentDocumentsPayloadDto } from '../dto';
import { EmailTemplateTypeEnum } from '../enum';
import { environment } from '../../environments';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly http: HttpService,
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly logger: Logger,
  ) { }

  public async getPayload(
    business: BusinessModelLocal,
    integration: IntegrationModel,
  ): Promise<PaymentPayloadInterface> {
    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.findOneByIntegrationAndBusiness(
      integration,
      business,
    );

    return subscription.payload as PaymentPayloadInterface;
  }

  public async updatePayload(
    business: BusinessModelLocal,
    integration: IntegrationModel,
    body: UpdatePaymentDocumentsPayloadDto,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.subscriptionService.findOneByIntegrationAndBusiness(
      integration,
      business,
    );
    let payload: PaymentPayloadInterface = subscription.payload;
    if (!payload) {
      payload = { };
    }

    if (body.documents) {
      if (!payload.documents) {
        payload.documents = body.documents;
      } else {
        for (const doc of body.documents) {
          const existingDoc: PaymentDocumentPayloadInterface
            = payload.documents.find((x: PaymentDocumentPayloadInterface) => x.type === doc.type);
          if (existingDoc) {
            existingDoc.blobName = doc.blobName;
            existingDoc.name = doc.name;
            existingDoc.fileName = doc.fileName;
          } else {
            payload.documents.push(doc);
          }
        }

        subscription.markModified('payload');
      }
    }

    subscription.payload = payload;

    if (body.application_sent) {
      subscription.payload.application_sent = true;
      subscription.markModified('payload');
    }

    await subscription.save();

    return subscription;
  }

  public async sendApplicationSubmitEmailNotification(
    integration: IntegrationModel,
    subscription: IntegrationSubscriptionModel,
    business: BusinessModelLocal,
    request: Request,
  ): Promise<void> {
    const usersRequest: Observable<AxiosResponse<any>> = this.http.get<any>(
      `${environment.usersBackendAPIUrlPrefix}/api/business/${business._id}`,
      {
        headers: {
          authorization: request.headers.authorization,
          'user-agent': request.headers['user-agent'],
        },
      },
    );
    const response: AxiosResponse<any> = await usersRequest.toPromise();
    const businessDTO: any = response.data;
    this.logger.log({
      message: 'businessDTO',
      request: businessDTO,
    });
    const emailDTO: PaymentMailInterface = this.createPaymentDto(
      businessDTO,
      integration,
      subscription,
    );

    this.logger.log({
      message: 'emailDTO',
      request: emailDTO,
    });
    await this.rabbitClient.send(
      {
        channel: 'payever.event.payment.email',
        exchange: 'async_events',
      },
      {
        name: 'payever.event.payment.email',
        payload: emailDTO,
      },
    );
  }

  public async clearPayloadDocuments(paymentMailSent: PaymentMailSentDto): Promise<void> {
    if (paymentMailSent.templateName !== EmailTemplateTypeEnum.ApplicationSentSantander) {
      return; 
    }

    const subscriptions: IntegrationSubscriptionModel[] =
      await this.subscriptionService.findByIds([paymentMailSent.serviceEntityId]);
    const subscription: IntegrationSubscriptionModel = subscriptions.length ? subscriptions[0] : null;

    if (!subscription || !subscription.payload) {
      return; 
    }

    const paymentPayload: UpdatePaymentDocumentsPayloadDto =
      plainToClass(UpdatePaymentDocumentsPayloadDto, subscription.payload);

    paymentPayload.application_sent = false;
    for (const document of paymentPayload.documents) {
      const url: string = 
      `${environment.microUrlMedia}/api/image/${paymentMailSent.businessId}/images/${document.blobName}`;
      this.logger.log({
        message: `Delete santander document for business ${paymentMailSent.businessId}`,
        url: url,
      });

      this.http.delete(url);
    }

    paymentPayload.application_sent = false;
    paymentPayload.documents = [];

    subscription.payload = paymentPayload;
    subscription.markModified('payload');

    await subscription.save();
  }

  private createPaymentDto(
    businessDTO: any,
    integration: IntegrationModel,
    subscription: IntegrationSubscriptionModel,
  ): PaymentMailInterface {
    let templateName: string;
    let emailTo: string;
    let emailCc: [string];
    if (
      integration.name === 'santander_installment' ||
      integration.name === 'santander_ccp_installment' ||
      integration.name === 'santander_pos_installment'
    ) {
      templateName = EmailTemplateTypeEnum.ApplicationSentSantander;
      emailTo = environment.santanderContractUploadEmail;
    } else if (integration.name === 'santander_installment_dk') {
      templateName = EmailTemplateTypeEnum.ApplicationSentSantanderDK;
      emailTo = environment.santanderDKemail;
      emailCc = [environment.santanderContractUploadEmail];
    } else if (
      integration.name === 'santander_installment_se' ||
      integration.name === 'santander_pos_installment_se' ||
      integration.name === 'santander_installment_no'
    ) {
      templateName = EmailTemplateTypeEnum.ApplicationSentSantanderSE;
      emailTo = environment.santanderSEemail;
      emailCc = [environment.santanderContractUploadEmail];
    } else {
      throw new BadRequestException(
        `${integration.name} not support application send`,
      );
    }

    const variables: any = {
      commercialExcerpt: { },
      contractFiles: [],
      files: [],
      merchant: {
        email: this.getEmail(businessDTO),
        hasCommercialExcerpt: false,
      },
    };
    this.logger.log({
      message: 'variables first',
      request: variables,
    });

    const paymentPayload: PaymentPayloadInterface = subscription.payload;
    if (paymentPayload.documents) {
      const commercialRegisterFile: PaymentDocumentPayloadInterface = paymentPayload.documents.find(
        (x: PaymentDocumentPayloadInterface) => x.type === 'commercialRegisterExcerptFilename',
      );
      this.logger.log({
        message: 'commercialRegisterFile',
        request: commercialRegisterFile,
      });
      variables.files = paymentPayload.documents.map((x: PaymentDocumentPayloadInterface) => {
        return {
          name: x.fileName,
          url: `${environment.storage_url}/images/${x.blobName}`,
        };
      });
      if (!!commercialRegisterFile) {
        variables.merchant.hasCommercialExcerpt = true;
        variables.commercialExcerpt = {
          fileName: commercialRegisterFile.name,
        };
      }

      variables.contractFiles = paymentPayload.documents
        .filter((x: PaymentDocumentPayloadInterface) => x.type !== 'commercialRegisterExcerptFilename')
        .map((x: PaymentDocumentPayloadInterface) => {
          return {
            paymentOptionDoc: {
              name: x.name,
            },
          };
        });
    }
    this.logger.log({
      message: 'variables last',
      request: variables,
    });

    return {
      business: {
        ...businessDTO,
        uuid: businessDTO._id,
      },
      cc: emailCc,
      locale: 'en',
      serviceEntityId: subscription._id,
      template_name: templateName,
      to: emailTo,
      variables: variables,
    };
  }

  private getEmail(businessDTO: any): string {
    if (businessDTO.contactEmails && businessDTO.contactEmails.length) {
      return businessDTO.contactEmails[0];
    }

    if (
      businessDTO.owner &&
      typeof businessDTO.owner === 'object' &&
      businessDTO.owner.userAccount &&
      businessDTO.owner.userAccount.email
    ) {
      return businessDTO.owner.userAccount.email;
    }

    return '';
  }
}
