/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OAuthTokenSchemaName } from '../../schemas';
import { OAuthTokenModel } from '../../models';

@Injectable()
export class VolumeReportOAuthTokenRetriever {
  constructor(
    @InjectModel(OAuthTokenSchemaName) private readonly oauthTokenModel: Model<OAuthTokenModel>,
  ) { }

  public async getOAuthTokenAvgResponseTime(
    dateFrom: Date,
    dateTo: Date,
  ): Promise<number> {
    const conditions: object = this.createBaseConditions(dateFrom, dateTo);

    const result: any[] = await this.oauthTokenModel.aggregate([
      {
        $match: conditions,
      },
      {
        $group: {
          '_id': null,
          'avg': { '$avg': '$executionTime' },
        },
      },
    ]);

    return result[0]?.avg ? result[0].avg : 0;
  }

  private createBaseConditions(
    dateFrom: Date,
    dateTo: Date,
  ): object {
    return {
      createdAt: { $gte: dateFrom, $lte: dateTo },
      executionTime: { $ne: null },
    };
  }
}
