import { ThemeEnum } from '../src/user/enums';
import { BaseMigration } from "@pe/migration-kit";
import { Collection, Db, MongoClient } from 'mongodb';

export class updateDefaultTheme extends BaseMigration {
  private async update(oldTheme: string, newTheme: string){
    const mongoClient: MongoClient = this.connection.getClient();
    const usersConnection: Db = mongoClient.db('users');
    const businessesCollection: Collection = usersConnection.collection('businesses');

    await businessesCollection.updateMany(
      {
        'themeSettings.theme': oldTheme,
      },
      {
        $set:{
          "themeSettings.theme": newTheme,
        }
      });

    await businessesCollection.updateMany(
      {
        'currentWallpaper.theme': oldTheme,
      },
      {
        $set:{
          "currentWallpaper.theme": newTheme,
        }
      });
  }
  public async up() {
    this.update('default', ThemeEnum.transparent);   
  }

  public async down() { 
    this.update(ThemeEnum.transparent, 'default');   
  }
  
  public description(): string {
    return `change the default theme to transparent`;
  }

  public migrationName(): string {
    return updateDefaultTheme.name;
  }

  public version(): number {
    return 2;
  }
}