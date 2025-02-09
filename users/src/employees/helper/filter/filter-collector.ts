import { BadRequestException, Injectable } from '@nestjs/common';
import { AbstractCollector, Collector } from '@pe/nest-kit';
import { ServiceTagEnum } from '../../enum';

@Injectable()
@Collector(ServiceTagEnum.FILTER_SERVICES)
export class FilterCollector extends AbstractCollector {

  constructor() {
    super();
  }

  public convertCondition(object: any): any {

    for (const key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }

      if (!Array.isArray(object[key])) {
        object[key] = { $regex: new RegExp(object[key], 'i') };
        continue;
      }

      for (const subValue of object[key]) {

        if (subValue.value && subValue.condition) {
          object[key] = this.convert(subValue);
        } else {
          object = this.convertNotCondition(subValue, object, key);
        }
      }

    }

    return object;
  }
  private convert(subValue: any): any {

    const { value }: any = subValue;
    for (const filter of this.services as any) {
      if (filter.identifier === subValue.condition) {

        return filter.applyFilter(value);
      }
    }

    throw new BadRequestException(`The entered value of Conditions is not correct.`);
  }

  private convertNotCondition(subValue: any, object: any, key: any): any {
    const subKey: string = Object.keys(subValue)[0];
    delete object[key];
    let regStr: string | string[] = subValue[subKey];

    if (Array.isArray(subValue[subKey])) {
      regStr = subValue[subKey].join('|');
    }

    if (object[`${key}.${subKey}`]) {
      const lastStr: string = object[`${key}.${subKey}`].$regex.toString().split('/')[1];
      object[`${key}.${subKey}`] = { $regex: new RegExp(`${regStr}|${lastStr}`, 'i') };
    } else {
      object[`${key}.${subKey}`] = { $regex: new RegExp(regStr as string, 'i') };
    }

    return object;
  }
}
