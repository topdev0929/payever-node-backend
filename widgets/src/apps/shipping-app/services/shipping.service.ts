import { Injectable } from '@nestjs/common';
import { IntercomService } from '@pe/nest-kit';
import { environment } from '../../../environments';
import { ShippingOrderStatsDto } from '../interfaces';

@Injectable()
export class ShippingService {
  private baseUrl: string;
  constructor(
    private readonly httpService: IntercomService,
  ) {
    this.baseUrl = environment.shippingServiceUrl;
  }


  public async getShippingOrderStatisticsByBusiness(businessId: string, token: string): Promise<ShippingOrderStatsDto> {
    const date: Date = new Date();
    const from: Date = new Date(date.getFullYear(), date.getMonth(), 1);

    const request: any = (await this.httpService.get<{ unread: number }>(
      `${this.baseUrl}/api/business/${businessId}/shipping-orders/widget-data?from=${from.toISOString()}`,
      {
        headers: {
          Authorixation: `bearer ${token}`,
        },
      },
    )).toPromise();

    return (await request).data;

  }
}
