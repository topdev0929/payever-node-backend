import { Injectable, Logger } from '@nestjs/common';
import { IntercomService } from '@pe/nest-kit';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse, AxiosError } from 'axios';

import { BusinessDto } from '../dto/business';
import { environment } from '../../environment/environment';
import { BusinessInterface, InstalledAppInterface, UserInterface } from '../interfaces/';
import { BusinessUserToContactConverter } from '../converter';
import { BaseCrmContactInterface } from '../../base-crm/interfaces';
import { NestKitLogFactory } from '@pe/nest-kit/modules/logging';

@Injectable()
export class BusinessDetailsResolverService {
  constructor(
    private readonly intercomService: IntercomService,
    private readonly logger: Logger,
  ) { }

  public async resolve(businessId: string): Promise<BaseCrmContactInterface> {
    const userBusiness: BusinessInterface = await (await this.intercomService.get<BusinessInterface>(
      `${environment.microUrlUsers}/api/business/${businessId}`,
    ))
      .pipe(
        map((response: AxiosResponse) => response.data),
      ).toPromise();

    const user: UserInterface = await (await this.intercomService.get<BusinessDto>(
      `${environment.microUrlUsers}/api/user/${userBusiness.owner}`,
    ))
      .pipe(
        map((response: AxiosResponse) => response.data),
        catchError((err: AxiosError, caught: Observable<any>) => {
          this.logger.error(NestKitLogFactory.getLogFromAxiosError(err));

          return throwError(`${err.message}: ${err.response ? JSON.stringify(err.response.data) : ''}`);
        }),
      ).toPromise();

    return BusinessUserToContactConverter.convert(user, await this.collectUserApps(user));
  }

  private async collectUserApps(user: UserInterface): Promise<string[]> {
    const result: string[] = [];

    for (const business of user.businesses) {
      const apps: InstalledAppInterface[] = await (
        await this.intercomService
          .get<InstalledAppInterface[]>(
            `${environment.microUrlCommerceos}/api/apps/business/${business._id}`,
          )
      )
        .pipe(map((response: AxiosResponse) =>  response.data))
        .toPromise();

      apps.forEach((app: InstalledAppInterface) => {
        if (app.installed && !result.includes(app.code)) {
          result.push(app.code);
        }
      });
    }

    return result;
  }
}
