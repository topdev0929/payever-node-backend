import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { SortDirectionEnum } from '../../dto/sort.dto';

@Injectable()
export class ParseSortDirPipe implements PipeTransform {
  public transform(value: any, metadata: ArgumentMetadata): string {
    if (value !== 'asc' && value !== 'desc' && value !== undefined) {
      throw new BadRequestException(`${metadata.data}: must be either "asc" or "desc"`);
    }

    return value === 'asc' ? SortDirectionEnum.ASC : SortDirectionEnum.DESC;
  }
}
