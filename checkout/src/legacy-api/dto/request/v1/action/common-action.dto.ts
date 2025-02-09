import { AmountActionInterface } from '../../../../interfaces';

export abstract class CommonActionDto implements AmountActionInterface {
  [key: string]: any;
}
