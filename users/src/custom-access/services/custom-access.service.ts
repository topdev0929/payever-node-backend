import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CustomAccessModel } from '../models';
import { CustomAccessSchemaEnum } from '../enums';
import { InjectModel } from '@nestjs/mongoose';
import { RedisClient } from '@pe/nest-kit';
import { CustomAccessExportDto } from '../dtos';

const whitelistUrls: string[] = [
  'employees/:businessId',
];

@Injectable()
export class CustomAccessService {
  constructor(
    @InjectModel(CustomAccessSchemaEnum.customAccess) private readonly customAccessModel: Model<CustomAccessModel>,
    private readonly redisClient: RedisClient,
  ) { }

  public async findByAccessId(
    customAccessId: string,
  ): Promise<CustomAccessModel> {
    const redisKey: string = `custom-access:user:${customAccessId}`;
    const redisData: any = await this.redisClient.get(redisKey);
    if (redisData && redisData !== 'null') {
      return JSON.parse(redisData);
    }

    const access: CustomAccessModel = await this.customAccessModel.findOne(
      {
        _id: customAccessId,
      },
    );
    await this.setRedis(redisKey, JSON.stringify(access));

    return access;
  }

  public async export(data: CustomAccessExportDto): Promise<void> {
    await this.customAccessModel.bulkWrite(data.customAccesses.map(
      (document: any) => {
        const urls: string[] = [
          ...whitelistUrls,
        ];

        for (let i: number = 0; i < urls.length; i++) {
          urls[i] = urls[i].replace(/:businessId/g, document.business);
        }

        const set: any = {
          access: document.access,
          application: document.application,
          business: document.business,
          urls: urls,
        };

        return {
          updateOne: {
            filter: { _id: document._id },
            update: { $set: { ...set } },
            upsert: true,
          },
        };
      }));
  }

  public async deleted(customAccessId: string): Promise<void> {
    await this.customAccessModel.deleteOne({ _id: customAccessId });
  }

  public async upsert(data: any): Promise<void> {
    const urls: string[] = [
      ...whitelistUrls,
    ];

    for (let i: number = 0; i < urls.length; i++) {
      urls[i] = urls[i].replace(/:businessId/g, data.business);
    }

    await this.customAccessModel.findOneAndUpdate(
      {
        _id: data._id,
      },
      {
        $set: {
          access: data.access,
          application: data.application,
          business: data.business,
          urls: urls,
        },
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  private async setRedis(redisKey: string, data: string): Promise<void> {
    const expiration: number = 25 * 60 * 60;
    await this.redisClient.set(
      redisKey,
      data,
      'EX', expiration,
    );
  }
}
