import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { EMAIL_TRANSFORMER } from '../../../constants';
import { ErrorNotificationAggregateDto, ErrorNotificationEmailDto } from '../../../dto';
import { EmailTemplateNamesEnum, ErrorNotificationTypesEnum } from '../../../enums';
import { AbstractTransformer } from './';
import { DateTransformer } from '../../../transformers';

@Injectable()
@ServiceTag(EMAIL_TRANSFORMER)
export class PaymentNotificationFailedTransformer extends AbstractTransformer {

  public async notificationErrorToEmailDto(
    aggregateDto: ErrorNotificationAggregateDto,
  ): Promise<ErrorNotificationEmailDto> {
    if (aggregateDto.type !== ErrorNotificationTypesEnum.paymentNotificationFailed) {
      return;
    }

    return {
      businessId: aggregateDto.businessId,
      locale: 'en',
      templateName: EmailTemplateNamesEnum.paymentNotificationFailed,
      variables: {
        errors: this.convertDate(this.transformErrors(aggregateDto.errors, aggregateDto.integration)),
      },
    };
  }

  private convertDate(sourceErrors: any[]): any[] {
    return sourceErrors.map( (item: any) => {
      return {
        ...item,
        firstFailure: item?.firstFailure ?
          DateTransformer.convertUTCToCETTimeZoneAndFormat(item.firstFailure) : undefined,
      };
    });
  }


}
