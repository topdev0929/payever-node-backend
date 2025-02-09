import { PipeTransform } from '@nestjs/common';

export class TasksFilterPipe implements PipeTransform {
  public transform(value: any): any {
    if (value && value.status && !Array.isArray(value.status)) {
      value.status = [value.status];
    }

    return value;
  }
}
