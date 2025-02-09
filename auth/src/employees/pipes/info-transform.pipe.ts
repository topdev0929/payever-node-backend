import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class InfoTransformPipe implements PipeTransform {
  transform(value: any): any {
    if (value.first_name) {
      value.firstName = value.first_name;
      delete value.first_name;
    }
    if (value.last_name) {
      value.lastName = value.last_name;
      delete value.last_name;
    }

    return value;
  }
}
