import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class BetweenFilter implements Filter {
  public identifier: Conditions = Conditions.Between;

  public applyFilter(value: any): any {
    
    return { $gt: value, $lt: value };
  }
}
