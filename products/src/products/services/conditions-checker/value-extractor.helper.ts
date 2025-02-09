export class ValueExtractorHelper {
  public static getValueByPath(path: string, product: object): any {
    const fields: string[] = path.split('.');
    let value: any = product;

    for (const field of fields) {
      value = value[field];
    }

    return value;
  }
}
