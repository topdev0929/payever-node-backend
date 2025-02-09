import { SalutationEnum } from '../enum';

export class SalutationTransformer {
  public static mapLegacyApiSalutationToPayeverEnum(salutation: string): SalutationEnum | string {
    switch (salutation) {
      case 'mrs':
      case 'ms':
        return SalutationEnum.MRS;
      case 'mr':
        return SalutationEnum.MR;
      default:
        return '';
    }
  }
}
