import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class IsNotInFilter implements Filter {
  public identifier: Conditions = Conditions.IsNotIn;

  public applyFilter(value: any): any {

    return { $nin: Array.isArray(value) ? value : [value] };
  }
}
