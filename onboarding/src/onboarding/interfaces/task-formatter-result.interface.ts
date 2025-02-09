import { ProcessingStatus } from '../enums';
import { ResultDataInterface } from './result-data.interface';

export interface TaskFormatterResultInterface {
  id: string;
  result: {
    [key: string]: ResultDataInterface;
  };
  status: ProcessingStatus;
}
