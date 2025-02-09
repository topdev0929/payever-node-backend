import { AccordionPanelInterface, HtmlInterface } from '../interfaces/views';

export class MainPanelView {
  public contentType: string;
  public title: string;
  public type: string;

  public content: {
    accordion: AccordionPanelInterface[];
    html: HtmlInterface;
  };

  constructor() {
    this.contentType = 'accordion';

    this.title = 'Billing subscriptions';
    this.type = 'info-box';
    this.content = {
      accordion: [],
      html: {
        icon: '#icon-check-rounded-16',
        innerHtml: `Subscriptions`,
      },
    };
  }

  public addPanel(panel: AccordionPanelInterface): void {
    this.content.accordion.push(panel);
  }
}
