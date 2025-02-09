export class AncestorHelper {
  public static buildAncestors(parentModel: any): string[] {
    let ancestors: string[] = [];
    if (parentModel) {
      ancestors = parentModel.ancestors ? [...parentModel.ancestors] : [];
      ancestors.push(parentModel.id);
    }

    return ancestors;
  }
}
