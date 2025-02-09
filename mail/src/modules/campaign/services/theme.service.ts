/* tslint:disable:no-nested-template-literals cognitive-complexity no-useless-cast */
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as https from 'https';
import { Browser, launch, Page } from 'puppeteer';
import { map, mergeMap } from 'rxjs/operators';

import {
  BaseThemeInterface,
  ConvertThemeResultInterface,
  ElementDetailsInterface,
  MarketingConvertThemeService,
  POPULAR_SCREEN_SIZES,
  ProductDetailsInterface,
  ProductsDetailsInterface,
  SizeInterface,
  StylesDisplay,
  StylesInterface,
  StylesService,
  ThemeDataInterface,
  ThemeDetailsInterface,
} from '@pe/builder-sdk';

import { environment } from '../../../environments';
import { CampaignModel } from '../models';

const timeout: (ms: number) => Promise<void> =
  (ms: number): Promise<void> => new Promise((res: (value?: void | PromiseLike<void>) => void) => setTimeout(res, ms));


const LOADING_PRODUCS_COUNT: number = 100;
const LOADING_PRODUCS_TIMEOUT: number = 100;

interface ConvertThemeParamsInterface {
  businessId: string;
  campaign: CampaignModel;
  accessToken: string;
  refreshToken: string;
  clientUrl: string;
  loginData: string;
  screenSizes?: SizeInterface[];
}

type OptionsGetType = {
  headers: {
      Authorization: string;
  };
  httpsAgent: https.Agent;
  params: {
      allData: boolean;
  };
};

type CookieType = {
  domain: string;
  expirationDate: string;
  path: string;
  name: string;
  value: string;
};

@Injectable()
export class ThemeService {

  private marketingConvertThemeService: MarketingConvertThemeService = new MarketingConvertThemeService();
  private httpService: HttpService = new HttpService();

  constructor(
    private readonly logger: Logger,
  ) { }

  public async convertTheme(params: ConvertThemeParamsInterface): Promise<ConvertThemeResultInterface> {
    const themeDetails: ThemeDetailsInterface[] = await this.extractThemeDetails(params);
    this.logger.log('converting theme');

    this.logger.log('convert theme');
    this.logger.log(`envMicroUrlBuilder: ${environment.microUrlBuilder}`);
    this.logger.log(`envCustomStorage: ${environment.microUrlCustomStorage}`);
    this.logger.log(`microUrlFrontendCommerceOS: ${environment.microUrlFrontendCommerceOS}`);

    const options: OptionsGetType = {
      headers: { Authorization: 'Bearer ' + params.accessToken },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      params: { allData: false },
      };
    const theme: BaseThemeInterface = await this.httpService.get<BaseThemeInterface>
    (`${environment.microUrlBuilder}/api/business/${params.businessId}/application/${params.campaign.id}`, {
      ...options,
    }).pipe(
      map((response: AxiosResponse<BaseThemeInterface>) => response.data),
      mergeMap(((baseTheme: BaseThemeInterface) => this.httpService.get<ThemeDataInterface>
      (`${environment.microUrlBuilder}/api/raw-data/${baseTheme.data || baseTheme.currentVersion[`data`]}`, {
        ...options,
      })
        .pipe(
          map((response: AxiosResponse<ThemeDataInterface>) => response.data),
          map((themeData: ThemeDataInterface) => ({
          ...baseTheme,
          data: themeData,
        }))))),
    )
    .toPromise().catch((err: any) => { throw new Error(err); });

    if (!theme) {
      this.logger.log('no theme');
    }

    const result: ConvertThemeResultInterface = this.marketingConvertThemeService.convertTheme({
      clientUrl: params.clientUrl,
      imagesStorage: environment.microUrlCustomStorage,
      subject: params.campaign.name,
      theme: theme,
      themeDetails: themeDetails,
    });

    this.logger.log('theme converted');

    if (!result) {
      this.logger.log('theme not converted');
    }

    return result;
  }

  public async convertThemeString(params: ConvertThemeParamsInterface): Promise<string> {
    const result: ConvertThemeResultInterface = await this.convertTheme(params);

    return JSON.stringify(result);
  }

  public async extractThemeDetails(params: ConvertThemeParamsInterface): Promise<ThemeDetailsInterface[]> {
    const previewUrl: string =
      `${environment.microUrlFrontendCommerceOS}/business/${params.businessId}/marketing/campaign/${params.campaign.id}/preview`;

    this.logger.log('launch browser');
    const browser: Browser = await launch({
      args: ['--no-sandbox'],
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
    });
    this.logger.log('browser launched');

    if (!browser) {
      this.logger.log('no browser');
      throw new Error('no headless browser');
    }
    const page: Page = await browser.newPage();
    this.logger.log('page created');

    const expirationDate: Date = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    this.logger.log(`domain for cookie: ${environment.microHostPrimaryMain}`);

    const cookie: CookieType[] = [
      {
        domain: `.${environment.microHostPrimaryMain}`,
        expirationDate: expirationDate.toUTCString(),
        name: 'pe_auth_token',
        path: '/',
        value: params.accessToken,
      },
      {
        domain: `.${environment.microHostPrimaryMain}`,
        expirationDate: expirationDate.toUTCString(),
        name: 'pe_refresh_token',
        path: '/',
        value: params.refreshToken,
      },
    ];

    await page.setCookie(...cookie);

    this.logger.log(`accessToken: ${params.accessToken}`);
    this.logger.log(`refreshToken: ${params.refreshToken}`);

    this.logger.log('page set cookies');
    this.logger.log(`go to: ${previewUrl} \n max timeout: 60000ms`);

    await page.goto(previewUrl, { timeout: 60000 });

    this.logger.log(`preview url is rendered`);

    await page.evaluate(
      (loginData: string, accessToken: string, refreshToken: string) => {
        if (loginData) {
          sessionStorage.setItem('pe.common.login.form', loginData);
        }
        localStorage.setItem('pe_auth_token', accessToken);
        localStorage.setItem('pe_refresh_token', refreshToken);
      },
      params.loginData,
      params.accessToken,
      params.refreshToken,
    );

    this.logger.log('page evaluated');
    this.logger.log(`page goto with tokens ${previewUrl}`);
    this.logger.log('route timeout is 60000ms');
    await page.goto(previewUrl, { timeout: 60000 });

    this.logger.log('wait for selector timeout is 60000ms');
    await page.waitForSelector('pe-content-viewer', { timeout: 60000 })
      .catch((error: any) => {
        this.logger.log('wait for selector error');
        this.logger.log(error);
      });

    this.logger.log('waitForLoadingProducts');
    await this.waitForLoadingProducts(page);

    this.logger.log('extract details');
    const themeDetails: ThemeDetailsInterface[] = await this.extractDetails(page, params.screenSizes);

    this.logger.log('details exctracted');

    await browser.close();
    this.logger.log('browser close');

    if (!themeDetails) {
      this.logger.log('no themeDetails');
    }

    return themeDetails;
  }

  private async extractDetails(page: Page, screenSizes?: SizeInterface[]): Promise<ThemeDetailsInterface[]> {
    const themeDetails: ThemeDetailsInterface[] = [];
    const screenSizesList: SizeInterface[] = screenSizes && screenSizes.length > 0 ? screenSizes : POPULAR_SCREEN_SIZES;
    for (const screenSize of screenSizesList) {
      await page.setViewport({ width: screenSize.width, height: screenSize.height });

      const themeDetailsItem: ThemeDetailsInterface = {
        areasDetails: [],
        scale: 1,
        widgetsDetails: [],
        width: screenSize.width,
      };

      const scale: string = await page.evaluate(() => {
        const viewerCanvasElement: HTMLElement = document.querySelector('.viewer-canvas');
        const transformString: string = viewerCanvasElement.style.transform;
        if (transformString) {
          return transformString.replace('scale(', '').replace(')', '');
        }

        return '1';
      });

      themeDetailsItem.scale = Number(scale);
      const themeDetailsItemString: string = await page.evaluate(
        (_themeDetailsItem: string) => {
          const themeDetailsItemParsed: ThemeDetailsInterface = JSON.parse(_themeDetailsItem);
          const widgetsNodes: NodeListOf<HTMLElement> = document.querySelectorAll('.widget');
          const widgets: HTMLElement[] = widgetsNodes && widgetsNodes.length > 0 ?
            Array.prototype.slice.call(widgetsNodes) :
            [];

          const getElementStyles: (element: HTMLElement) => StylesInterface
            = (element: HTMLElement): StylesInterface => {
            return {
              bottom: element.style.bottom,
              display: element.style.display as StylesDisplay,
              height: element.style.height,
              left: element.style.left,
              minHeight: element.style.minHeight,
              minWidth: element.style.minWidth,
              right: element.style.right,
              top: element.style.top,
              width: element.style.width,
              zIndex: element.style.zIndex,
            };
          };

          const tryExtractProductsDetails: (widget: HTMLElement) => ProductsDetailsInterface
            = (widget: HTMLElement): ProductsDetailsInterface => {
            const productsWidget: HTMLElement = widget.querySelector('pe-widget-featured-products-view');
            if (!!productsWidget) {
              const products: ProductDetailsInterface[] = [];
              let itemsPerRow: number = 0;
              const productTileItemNodes: NodeListOf<HTMLElement> = widget.querySelectorAll('.mat-grid-tile');
              if (productTileItemNodes && productTileItemNodes.length) {
                const productTileItems: HTMLElement[] = Array.prototype.slice.call(productTileItemNodes);
                for (const productTileItem of productTileItems) {
                  const productItem: HTMLElement = productTileItem.querySelector('pe-product-item');
                  if (productItem) {
                    const salePriceElement: HTMLElement = productItem.querySelector('.sale-price');
                    products.push({
                      id: productItem.dataset.productId,
                      logo: (productItem.querySelector('.product-image') as HTMLImageElement) &&
                        (productItem.querySelector('.product-image') as HTMLImageElement).src,
                      price: productItem.querySelector('.product-price').innerHTML,
                      salePrice: salePriceElement ? salePriceElement.innerHTML : '',
                      title: productItem.querySelector('.product-title').innerHTML,
                    });
                  }
                }
                const gridList: HTMLElement = widget.querySelector('.mat-grid-list');
                if (gridList) {
                  itemsPerRow = Math.round(
                    gridList.getBoundingClientRect().width / productTileItems[0].getBoundingClientRect().width,
                  );
                }
              }

              return { products, itemsPerRow };
            }

            return null;
          };

          for (const widget of widgets) {
            themeDetailsItemParsed.widgetsDetails.push({
              id: widget.dataset.widgetId,
              offsetHeight: widget.offsetHeight,
              offsetWidth: widget.offsetWidth,
              productsDetails: tryExtractProductsDetails(widget),
              rect: widget.getBoundingClientRect(),
              styles: getElementStyles(widget),
            });
          }
          const areasNodes: NodeListOf<HTMLElement> = document.querySelectorAll('.widgets-area');
          const areas: HTMLElement[]
            = areasNodes && areasNodes.length > 0 ? Array.prototype.slice.call(areasNodes) : [];
          for (const area of areas) {
            themeDetailsItemParsed.areasDetails.push({
              id: area.dataset.areaId,
              offsetHeight: area.offsetHeight,
              offsetWidth: area.offsetWidth,
              rect: area.getBoundingClientRect(),
              styles: getElementStyles(area),
            });
          }

          return JSON.stringify(themeDetailsItemParsed);
        },
        JSON.stringify(themeDetailsItem),
      );

      themeDetails.push(JSON.parse(themeDetailsItemString));
    }

    return themeDetails;
  }

  private async waitForLoadingProducts(page: Page): Promise<void> {
    for (let i: number = 0; i < LOADING_PRODUCS_COUNT; i++) {
      const isLoadingProducts: boolean = await page.evaluate(() => {
        return !!document.querySelector('.products-loader');
      });
      if (!isLoadingProducts) {
        break;
      }
      await timeout(LOADING_PRODUCS_TIMEOUT);
    }
  }
}
