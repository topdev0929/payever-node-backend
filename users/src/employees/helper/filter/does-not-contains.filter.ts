import { Conditions, ServiceTagEnum } from '../../enum';
import { Filter } from '../../interfaces';
import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

@Injectable()
@ServiceTag(ServiceTagEnum.FILTER_SERVICES)
export class DoesNotContainFilter implements Filter {
  public identifier: Conditions = Conditions.DoesNotContain;

  public applyFilter(value: any): any {

    return { $not: new RegExp(`${Array.isArray(value) ? value.join('|') : value}`, 'i') };
  }
}
