import { PostParseErrorDto } from '../../file-processor/dto';

export const ProductImportedEventName: string = 'product-files.event.product.imported';
export const ImportFailedEventName: string = 'product-files.event.import.failed';
export const ImportSuccessEventName: string = 'product-files.event.import.success';
export const ImportRequestedEventName: string = 'product-files.event.import.requested';

export interface FileImportEventInterface<T> {
  business: { id: string };
  synchronization: { taskId: string };
  errors ?: PostParseErrorDto[];
  data: T;
}
