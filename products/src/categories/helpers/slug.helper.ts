export class SlugHelper {
  public static getSlug(name: string): string {
    return encodeURIComponent(name.toLowerCase().replace('&', 'and').trim().split(' ').join('_'));
  }
}
