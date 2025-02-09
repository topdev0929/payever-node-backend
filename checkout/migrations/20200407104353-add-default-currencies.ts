'use strict';

import { BaseMigration } from "@pe/migration-kit";
import { currencies } from '../fixtures/currencies.fixture';

export class AddDefaultCurrenciesMigrarion extends BaseMigration {

  public async up(): Promise<void> {
    for (const currency of currencies) {
      const existing: any = await this.connection.collection('currencies').findOne({ _id : currency._id });
      if(!existing) {
        await this.connection.collection('currencies').insertOne(currency);
      }
    }
  
    return null;
  };
  
  public async down(): Promise<void> {

    return null;
  }

  public description(): string {
    return "Add new default values of currencies";
  }

  public migrationName(): string {
    return "AddDefaultCurrenciesMigrarion";
  }

  public version(): number {
    return 1;
  }

}
