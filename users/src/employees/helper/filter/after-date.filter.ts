import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';
import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class AfterDateFilter implements Filter {
  public identifier: Conditions = Conditions.AfterDate;

  public applyFilter(value: any): any {

    return { $gte: new Date(value) };
  }
}
