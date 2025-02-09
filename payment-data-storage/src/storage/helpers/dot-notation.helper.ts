export class DotNotationHelper {
  public static set(obj: { }, path: string, value: any): { } {
    return this.process(obj, path.split('.'), value);
  }

  private static process(obj: { }, path: string[], value: any): { } {
    obj = obj ? obj : { };

    switch (true) {
      case path.length === 0:
        break;
      case path.length === 1:
        obj[path[0]] = value;
        break;
      default:
        obj[path[0]] = this.process(obj[path[0]], path.slice(1), value);
    }

    return obj;
  }
}
