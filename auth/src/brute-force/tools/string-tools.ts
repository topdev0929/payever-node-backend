export class StringTools {
  public static isValidString(str: string): boolean {
    return str && !!str.trim();
  }
}
