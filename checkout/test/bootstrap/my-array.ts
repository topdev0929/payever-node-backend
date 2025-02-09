export class MyArray<T> extends Array<T> {
  private constructor(items?: T[]) {
      super(...items)
  }

  public pull(...args: any[]): any {}

  public static create<T>(): MyArray<T> {
      return Object.create(MyArray.prototype);
  }
}
