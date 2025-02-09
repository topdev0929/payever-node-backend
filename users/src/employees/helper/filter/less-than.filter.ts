import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class LessThanFilter implements Filter {
  public identifier: Conditions = Conditions.LessThan;

  public applyFilter(value: any): any {

    return { $lt: value };
  }
}
