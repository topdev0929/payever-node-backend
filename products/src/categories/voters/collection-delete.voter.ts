import { Injectable } from '@nestjs/common';

import { AbstractVoter, AccessTokenPayload, AclActionsEnum, RolesEnum, Voter } from '@pe/nest-kit';
import { BusinessAccessValidator } from '@pe/nest-kit/modules/auth/access-validators/special';
import { CollectionModel } from '../models';

@Injectable()
@Voter()
export class CollectionDeleteVoter extends AbstractVoter {
  public static readonly DELETE: string = 'collection-delete';

  protected async supports(attribute: string, subject: any): Promise<boolean> {
    return attribute === CollectionDeleteVoter.DELETE;
  }

  protected async voteOnAttribute(
    attribute: string,
    collections: CollectionModel | CollectionModel[],
    user: AccessTokenPayload,
  ): Promise<boolean> {

    if (!user) {
      return false;
    }

    const checkCollections: CollectionModel[] = Array.isArray(collections)
      ? collections
      : [collections];

    for (const collection of checkCollections) {
      const isAllowed: boolean = BusinessAccessValidator.isAccessAllowed(
        user.getRole(RolesEnum.merchant),
        [
          { microservice: 'products', action: AclActionsEnum.create},
        ],
        collection.businessId,
      );

      if (!isAllowed) {
        return false;
      }
    }

    return true;
  }
}
