import { Injectable } from '@nestjs/common';
import { MainPanelView, SettingsFormView, DisableConfirmationFormView } from '../views';
import { ConnectionService } from './connection.service';
import { BusinessModel } from '../../business';
import { ConnectionModel } from '../models';
import { environment } from '../../environments';

@Injectable()
export class SettingsFormBuilder {
  private apiUrl: string;
  private supportedIntegrations: string[];

  constructor(
    private readonly connectionService: ConnectionService,
  ) {
    this.apiUrl = environment.billingSubscriptionUrl;
    this.supportedIntegrations = environment.supportedIntegrations;
  }

  public async buildSettingsForm(business: BusinessModel): Promise<MainPanelView> {
    const mainPanel: MainPanelView = new MainPanelView();

    const connections: ConnectionModel[] = await this.connectionService.getConnections(
      business,
    );
    const filteredConnections: ConnectionModel[] = connections.filter(
      (connection: ConnectionModel) => this.supportedIntegrations.indexOf(connection.integrationName) !== -1,
    );

    mainPanel.addPanel(
      new SettingsFormView(
        `${this.apiUrl}/api/settings/${business.id}`,
        filteredConnections,
      ),
    );

    return mainPanel;
  }

  public async buildDisableConfirmationForm(
    business: BusinessModel,
    connection: ConnectionModel,
  ): Promise<DisableConfirmationFormView> {
    return new DisableConfirmationFormView(
      `${this.apiUrl}/api/settings/${business.id}`,
      connection,
    );
  }
}
