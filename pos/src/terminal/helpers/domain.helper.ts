import * as accents from 'remove-accents';

export class DomainHelper {
  public static nameToDomain(name: string): string {
    if (!name) {
      return name;
    }

    name = accents.remove(name);

    return name.replace(/[^a-zA-Z\d:]+/g, '-')
      .replace(/^-/gm, '')
      .replace(/(.*)-$/gm, `$1`)
      .toLowerCase();
  }
}
