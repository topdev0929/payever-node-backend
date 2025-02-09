import { Injectable } from '@nestjs/common';
import { InnerActionModel, IntegrationModel } from '../models';

@Injectable()
export class ActionChooser {

  public static chooseAppropriateAction(
    integration: IntegrationModel,
    actionName: string,
  ): InnerActionModel {
    const predicate: (item: InnerActionModel) => boolean =
      (item: InnerActionModel): boolean => item.name === actionName;

    let action: InnerActionModel = integration.actions.find(predicate);

    if (!action && this.hasOwnActions(integration)) {
      action = integration.actions.find(predicate);
    }

    return action;
  }

  public static chooseAppropriateClientAction(
    integration: IntegrationModel,
    actionName: string,
  ): InnerActionModel {
    const action: InnerActionModel = this.chooseAppropriateAction(integration, actionName);

    return action && action.isClientAllowed
      ? action
      : null
      ;
  }

  private static hasOwnActions(integration: IntegrationModel): boolean {
    return integration.actions && !!integration.url;
  }
}
