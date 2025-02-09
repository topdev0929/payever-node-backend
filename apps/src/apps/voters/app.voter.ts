import { AbstractVoter, AccessTokenPayload, Voter } from '@pe/nest-kit';
import { AppModel } from '../models';

@Voter()
export class AppVoter extends AbstractVoter {
  public static VIEW: string = 'view_app';
  public static EDIT: string = 'edit_app';
  public static DELETE: string = 'delete_app';

  protected async supports(attribute: string, subject: AppModel): Promise<boolean> {
    return [AppVoter.VIEW, AppVoter.EDIT, AppVoter.DELETE].includes(attribute);
  }

  protected async voteOnAttribute(
    attribute: string,
    app: AppModel,
    { user }: { user: AccessTokenPayload },
  ): Promise<boolean> {
    switch (attribute) {
      case AppVoter.VIEW:
      case AppVoter.EDIT:
      case AppVoter.DELETE:
        return AppVoter.isOwner(app, user);
    }

    return false;
  }

  private static isOwner(app: AppModel, user: AccessTokenPayload): boolean {
    return app.owner === user.id;
  }
}
