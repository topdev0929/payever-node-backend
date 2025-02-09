import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { EMAIL_TRANSFORMER } from '../../../constants';
import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../../../dto';
import { EmailTemplateNamesEnum, ErrorNotificationTypesEnum } from '../../../enums';
import { AbstractTransformer } from './';

@Injectable()
@ServiceTag(EMAIL_TRANSFORMER)
export class ThirdpartyErrorTransformer extends AbstractTransformer {

  public async notificationErrorToEmailDto(
    aggregateDto: ErrorNotificationAggregateDto,
  ): Promise<ErrorNotificationEmailDto> {
    if (aggregateDto.type !== ErrorNotificationTypesEnum.thirdPartyError) {
      return;
    }

    return {
      businessId: aggregateDto.businessId,
      locale: 'en',
      templateName: EmailTemplateNamesEnum.thirdPartyError,
      variables: {
        errors: this.transformErrors(aggregateDto.errors),
      },
    };
  }

}
