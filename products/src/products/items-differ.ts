export interface Item {
  id: string;
}

export class ItemsDiffer {
  private oldIds: Map<string, Item>;
  private newIds: Map<string, Item>;

  constructor(oldItems: Item[], newItems: Item[]) {
    if (!Array.isArray(oldItems)) {
      oldItems = [];
    }
    this.oldIds = new Map(oldItems.map((x: Item) => [x.id, x]));

    if (!Array.isArray(newItems)) {
      newItems = [];
    }
    this.newIds = new Map(newItems.filter((x: Item) => x.id).map((x: Item) => [x.id, x]));
  }

  get delete(): any[] {
    return [...this.oldIds.keys()].filter((x: string) => !this.newIds.has(x)).map((x: string) => this.oldIds.get(x));
  }
}
