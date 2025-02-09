import { BrowserService } from '../services';

export const BrowserServiceProvider: any = () => {
  return {
    inject: [],
    provide: BrowserService,
    useFactory: () => {
      return new BrowserService().initBrowser();
    },
  };
};
