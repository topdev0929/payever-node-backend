export class UrlHelper {
  public static getExtention(blob: string): string {
    const regexp: RegExp = /.+\.(.+)/g;
    const array: string[][] = [...blob.matchAll(regexp)];

    return array[0][1];
  }
}
