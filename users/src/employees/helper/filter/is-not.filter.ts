import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class IsNotFilter implements Filter {
  public identifier: Conditions = Conditions.IsNot;

  public applyFilter(value: any): any {

    return { $ne: Array.isArray(value) ? value[0] : value };
  }
}
