import * as dm from 'deepmerge';

const overwriteMerge: any = (destinationArray: any[], sourceArray: any[], options?: dm.Options) => sourceArray;

export class ObjectMerger {
  public static merge(...args: any): any {
    return dm.all(
      [ ...args ],
      { arrayMerge: overwriteMerge },
    );
  }
}
