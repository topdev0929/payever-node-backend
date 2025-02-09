import { ConnectionModel } from '../models';

export class DisableConfirmationFormView {
  public title: string;
  public type: string;
  public confirmContent: any;

  constructor(settingsApiUrl: string, connection: ConnectionModel) {
    this.title = '';
    this.type = 'confirm';
    this.confirmContent = {
      operations: [
        {
          request: {
            url: `${settingsApiUrl}/form`,
          },
          text: 'No',
        },
        {
          request: {
            url: `${settingsApiUrl}/disable/${connection.id}`,
          },
          text: 'Yes',
        },
      ],
      text: 'This will stop all current subscriptions.',
      title: `Are you sure you want to disable "${connection.integrationName}"?`,
    };
  }
}
