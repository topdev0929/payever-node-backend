import { Injectable } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { LeanDocument } from 'mongoose';

import { ElasticAppointmentEnum } from '../enums';
import { AppointmentDocument } from '../schemas';
import { AppointmentService } from './appointment.service';

@Injectable()
export class ElasticSearchService {

  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly appointmentService: AppointmentService,
  ) { }

  public getFilter(
    businesses: string[],
    filterPrototype: any,
  ): any {
    return {
      ...filterPrototype,
      filter: [
        {
          bool: {
            should: businesses.map((businessId: string) => ({
              match: {
                businessId,
              },
            })),
          },
        },
        ...(filterPrototype.filter || []),
      ],
    };
  }

  public async search<T>(
    filters: any,
    sorting: { [key: string]: string },
    paging: {
      page: number;
      limit: number;
    },
  ): Promise<{ collection: T[]; total: number }> {
    if (! await this.isIndexExists()) {
      throw new Error('Index doesn\'t exist');
    }

    const body: any = {
      from: paging.limit * (paging.page - 1),
      query: {
        bool: filters,
      },
      size: paging.limit,
    };

    return this.elasticSearchClient.search(ElasticAppointmentEnum.index, body)
      .then((results: any) => results && results.body && ({
        collection: results.body.hits.hits.map((x: any) => x._source),
        total: results.body.hits.total,
      }));
  }

  public async deleteById(id: string): Promise<void> {
    await this.elasticSearchClient.deleteByQuery(
      ElasticAppointmentEnum.index,
      {
        query: {
          bool: {
            must: [{
              match: {
                mongoId: id,
              },
            }],
          },
        },
      },
    );
  }

  public async isIndexExists(): Promise<boolean> {
    return this.elasticSearchClient.isIndexExists(ElasticAppointmentEnum.index);
  }
}
