import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class IsDateFilter implements Filter {
  public identifier: Conditions = Conditions.IsDate;

  public applyFilter(value: any): any {

    return new Date(Array.isArray(value) ? value[0] : value);
  }
}
