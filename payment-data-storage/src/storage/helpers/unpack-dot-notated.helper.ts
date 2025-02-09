import { DotNotationHelper } from './dot-notation.helper';

export class UnpackDotNotatedHelper {
  public static process(obj: { }): { } {
    const result: { } = { };

    return this.processElement(obj, result);
  }

  private static processElement(obj: { }, result: { }): { } {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key.indexOf('.') !== -1) {
          DotNotationHelper.set(result, key, obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }

    return result;
  }
}
