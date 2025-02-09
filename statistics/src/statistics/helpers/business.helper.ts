import { Injectable } from '@nestjs/common';
import { BusinessModel } from '../models';

@Injectable()
export class BusinessServiceHelper {
  public availableTypes(business: BusinessModel): string[] {
    return business.installedApps.filter((app: any) => app.installed).map((app: any) => app.code);
  }

  public isAvailableType(business: BusinessModel, type: string): boolean {
    return this.availableTypes(business).includes(type);
  }
}
