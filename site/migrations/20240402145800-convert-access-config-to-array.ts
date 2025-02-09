// tslint:disable:object-literal-sort-keys
import { BaseMigration } from "@pe/migration-kit";

export class ConvertAccessConfigToArray extends BaseMigration {
  public async up(): Promise<void> {
    const siteCollection = await this.connection.collection('sites');
    const sites = await siteCollection.find().toArray();
    
    for(let rec of sites){
      await siteCollection.update({_id:rec._id},{
        $set:{accessConfig:[rec.accessConfig]}
      })
    }
  }
  public async down(): Promise<void> {
    return null;
  }
  public description(): string {
    return 'Convert accessConfig to Array';
  }
  public migrationName(): string {
    return '20240402145800-convert-access-config-to-array';
  }
  public version(): number {
    return 1;
  }
}
