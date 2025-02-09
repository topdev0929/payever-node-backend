import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class IsInFilter implements Filter {
  public identifier: Conditions = Conditions.IsIn;

  public applyFilter(value: any): any {

    return { $in: Array.isArray(value) ? value : [value] };
  }
}
