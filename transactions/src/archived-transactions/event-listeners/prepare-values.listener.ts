import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { CommonEventNamesEnum } from '@pe/common-sdk';
import { ANONYMIZED_TABLE_FIELDS, ANONYMIZED_DETAILS_FIELDS } from '../constants';

@Injectable()
export class PrepareValuesListener {

  @EventListener(CommonEventNamesEnum.commonPrepareValuesEvent)
  public async onPrepareValues(): Promise<any>  {
    return {
      anonymizedFields: {
        details: ANONYMIZED_DETAILS_FIELDS,
        table: ANONYMIZED_TABLE_FIELDS,
      },
    };
  }
}
