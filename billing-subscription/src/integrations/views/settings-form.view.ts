import { AccordionPanelInterface, FieldsetData, InfoBoxActionInterface } from '../interfaces/views';
import { ConnectionModel } from '../models';
import { HttpMethodsEnum } from '../enums';

export class SettingsFormView implements AccordionPanelInterface {
  public title: string = 'Payment integrations';
  public operation: InfoBoxActionInterface;
  public icon: string = '#icon-settings';
  public data: any;
  public fieldsetData: FieldsetData;

  constructor(saveFormUrl: string, connections: ConnectionModel[]) {
    this.data = [];
    for (const connection of connections) {
      this.data.push([
        {
          type: 'text',
          value: connection.integrationName,
        },
        {
          checked: connection.isEnabled,
          requestOff: {
            method: HttpMethodsEnum.POST,
            url: `${saveFormUrl}/disable/confirmation/${connection.id}`,
          },
          requestOn: {
            method: HttpMethodsEnum.POST,
            url: `${saveFormUrl}/enable/${connection.id}`,
          },
          size: 'xs',
          type: 'toggle',
        },
      ]);
    }
  }
}
