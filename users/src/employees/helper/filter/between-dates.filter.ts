import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class BetweenDatesFilter implements Filter {
  public identifier: Conditions = Conditions.BetweenDates;

  public applyFilter(value: any): any {

    return { $gte: new Date(value), $lte: new Date(value) };
  }
}

