'use strict';

import { BaseMigration } from "@pe/migration-kit";
import { categories } from "../fixtures/categories.fixture";

const categoriesCollection: string = 'categories';
const integrationName: string = 'design';

export class AddDesignCategory extends BaseMigration {

  public async up(): Promise<void> {
    const category: any = categories.find((cat: any) => cat.name === integrationName);
    await this.connection.collection(categoriesCollection).insert(category);
    return;
  };

  public async down(): Promise<void> {
    return;
  };

  public description(): string {
    return "Add Design Category";
  };

  public migrationName(): string {
    return "AddDesignCategory";
  };

  public version(): number {
    return 1;
  };

}
