import { MessageResponseInterface } from './message-response.interface';

export interface BusinessWidgetTutorialResponseInterface extends MessageResponseInterface {
  id: string;
  tutorialList?: Array<{
    widgetId?: string;
    widgetOrder?: number;
    widgetType?: string;
    watched?: boolean;

    icon?: string;
    title?: string;
    showOnTutorial?: boolean;
    url?: string;
    urls?: Array<{
      language?: string;
      url?: string;
    }>;
  }>;
}
