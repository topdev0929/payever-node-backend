import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from "@nestjs/mongoose";
import { CompiledThemeSchemaName } from "@pe/builder-theme-kit";
import { AccessConfigModel } from "../../../src/application-builder-theme/models";

const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const APPLICATION_ID: string = 'ssssssss-ssss-ssss-ssss-ssssssssssss';

class DomainFixture extends BaseFixture {
  private readonly accessConfigModel: Model<AccessConfigModel>
  = this.application.get('AccessConfigModel');
  protected readonly compiledThemeModel: Model<any>
    = this.application.get(getModelToken(CompiledThemeSchemaName));

  public async apply(): Promise<void> {
    await this.accessConfigModel.create(
      {
        "_id": ACCESS_CONFIG_ID,
        "isLive": true,
        "isLocked": false,
        "isPrivate": false,
        "application": APPLICATION_ID,
        "__v": 0
      }
    );

    await this.compiledThemeModel.create(
      {
        "_id": "660d35e4-5042-41fc-a475-4156646e9822",
        "__v": 0,
        "application": APPLICATION_ID,
        "builderVersion": "2",
        "context": {},
        "data": {
          "productPages": "/products/:productId",
          "categoryPages": "/zubehor/:categoryId",
          "languages": [
            {
              "language": "english",
              "active": true,
            },
            {
              "language": "german",
              "active": true,
            }
          ],
          "defaultLanguage": "english",
        },
        "versionNumber": 43,
      },
    )
  }
}

export = DomainFixture;
