import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class ReqIdPipe implements PipeTransform {
  public async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (value && value.param) {
      value = value.param;
    }

    return value;
  }
}
