import { Injectable } from '@nestjs/common';
import { UserTokenInterface } from '@pe/nest-kit';
import { AxiosResponse } from 'axios';
import { environment } from '../../environments';
import { TaskProcessor } from '../decorators/task.processor';
import { RabbitBinding, TaskType } from '../enums';
import { TaskModel } from '../models';
import { AbstractProcessor } from './abstract.processor';
import {
  BusinessPayloadInterface,
} from '../interfaces/incoming';
import {
  BusinessCreateBusinessPayloadInterface,
  BusinessCreatePayloadInterface,
} from '../interfaces/outgoing';
import { PreloadMediaProcessor } from './preload-media.processor';
import { ReportDetailDocument } from '../schemas';
import { RunInstructionResult, ValidateInstructionResultDataInterface } from '../interfaces';
import { pick, isMatch } from 'lodash';

@Injectable()
@TaskProcessor(TaskType.Business)
export class BusinessProcessor extends AbstractProcessor  {
  protected name: string = TaskType.Business;
  protected required: string[] = [
    TaskType.PreloadMedia,
  ];

  public async runInstruction(task: TaskModel): Promise<RunInstructionResult> {
    const mediaLogoUrl: string = task.resultData[PreloadMediaProcessor.name]?.result?.logo;
    const payload: BusinessCreatePayloadInterface = this.composeBusinessPayload(
      task.businessId,
      task.user,
      {
        ...task.incomingData.business,
        logo: `${environment.microservices.customStorage}/images/${mediaLogoUrl}`,
      },
    );

    await this.rabbitClient.send(
      {
        channel: RabbitBinding.OnboardingSetupBusiness,
        exchange: 'async_events',
      },
      {
        name: RabbitBinding.OnboardingSetupBusiness,
        payload: { userToken: task.user, createBusinessDto: payload, createUserDto: { } },
      },
    );

    return { };
  }

  public async revertInstruction(task: TaskModel): Promise<void> {
    // delete business
  }

  public async validateInstruction(
    task: TaskModel, 
    reportDetail: ReportDetailDocument,
  ): Promise<ValidateInstructionResultDataInterface> {
    const businessDetailsResult: AxiosResponse<BusinessCreateBusinessPayloadInterface> = 
    await this.httpService.get<BusinessCreateBusinessPayloadInterface>(
      [
        environment.microservices.usersUrl,
        `/api/business/${task.businessId}/detail`,
      ].join(''),
      this.getAxiosRequestConfig(task),
    ).toPromise();

    const actualDetails: Partial<BusinessCreateBusinessPayloadInterface> = 
    this.getDetails(businessDetailsResult.data);

    const expectedDetails: Partial<BusinessCreateBusinessPayloadInterface> = 
    this.getDetails(task.incomingData.business);

    const actual: any = { ...actualDetails, logo: !!businessDetailsResult.data.logo };
    const expected: any = { ...expectedDetails, logo: !!task.incomingData.business.logo };

    return {
      actual,
      expected,
      valid: isMatch(actual, expected),
    };
  }

  private getDetails(
    data: BusinessCreateBusinessPayloadInterface | BusinessPayloadInterface,
  ): Partial<BusinessCreateBusinessPayloadInterface> {
    return pick(data, ['name', 'currency', 'hidden', 
    'companyAddress', 'companyDetails', 'bankAccount', 'contactEmails']);
  }

  private composeBusinessPayload(
    businessId: string,
    user: UserTokenInterface,
    businessData: BusinessPayloadInterface,
  ): BusinessCreatePayloadInterface {
    return {
      active: true,
      bankAccount: businessData.bankAccount,
      businessId,
      companyAddress: businessData.companyAddress,
      companyDetails: businessData.companyDetails,
      contactDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: businessData.companyDetails.phone,
      },
      contactEmails: businessData.contactEmails,
      currency: businessData.currency,
      defaultLanguage: businessData.defaultLanguage,
      email: user.email,
      firstName: user.firstName,
      hidden: false,
      id: businessId,
      lastName: user.lastName,
      logo: businessData.logo,
      name: businessData.name,
      taxes: businessData.taxes,
    };
  }
}
