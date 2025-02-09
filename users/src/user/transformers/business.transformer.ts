import { BusinessActiveModel, BusinessModel } from '../models';
import { UserInterface } from '../interfaces';

export class BusinessTransformer {
  public static transform(businesses: BusinessModel[], active: BusinessActiveModel): any[] {
    return businesses.map((business: BusinessModel) => {
      const data: any = {
        _id: business._id,
        logo: business.logo,
        name: business.name,

        email: (business.owner as UserInterface)?.userAccount?.email,
        userId: (business.owner as UserInterface)?._id || business.owner,
      };

      if (active !== null) {
        data.active = (data._id === active.businessId);
      }

      return data;
    });
  }
}
