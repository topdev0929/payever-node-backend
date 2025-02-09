import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class BeforeDatesFilter implements Filter {
  public identifier: Conditions = Conditions.BeforeDate;

  public applyFilter(value: any): any {

    return { $lte: new Date(value) };
  }
}
