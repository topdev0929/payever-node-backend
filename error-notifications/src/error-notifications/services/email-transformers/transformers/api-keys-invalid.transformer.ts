import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { EMAIL_TRANSFORMER } from '../../../constants';
import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../../../dto';
import { EmailTemplateNamesEnum, ErrorNotificationTypesEnum } from '../../../enums';
import { AbstractTransformer } from './';

@Injectable()
@ServiceTag(EMAIL_TRANSFORMER)
export class ApiKeysInvalidTransformer extends AbstractTransformer {

  public async notificationErrorToEmailDto(
    aggregateDto: ErrorNotificationAggregateDto,
  ): Promise<ErrorNotificationEmailDto> {
    if (aggregateDto.type !== ErrorNotificationTypesEnum.apiKeysInvalid) {
      return;
    }

    return {
      businessId: aggregateDto.businessId,
      locale: 'en',
      templateName: EmailTemplateNamesEnum.apiKeysInvalid,
      variables: {
        errors: this.transformErrors(aggregateDto.errors),
      },
    };
  }

}
