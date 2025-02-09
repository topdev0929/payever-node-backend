import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export default class GreaterThanFilter implements Filter {
  public identifier: Conditions = Conditions.GreaterThan;

  public applyFilter(value: any): any {

    return { $gt: value };
  }
}
