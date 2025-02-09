import { UserAlbumModel } from '../models';

export class AncestorHelper {
  public static buildAncestors(parentModel: UserAlbumModel): string[] {
    let ancestors: string[] = [];
    if (parentModel) {
      ancestors = parentModel.ancestors ? [...parentModel.ancestors] : [];
      ancestors.push(parentModel.id);
    }

    return ancestors;
  }
}
