import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

let browserPage: puppeteer.Page;
let browserContext: puppeteer.Context;

@Injectable()
export class BrowserService {
  constructor (
  ) {
  }

  public async initBrowser(): Promise<BrowserService> {
    return this.initPuppeteer();
  }

  public getContext(): any {
    return browserContext;
  }

  public getPage(): any {
    return browserPage;
  }

  private async initPuppeteer(): Promise<BrowserService> {
    if (!browserContext) {
      const browser: puppeteer.Browser = await puppeteer.launch({
        args: [
          '--disable-gpu',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],
        headless: true,
      });
      browserContext = await browser.createIncognitoBrowserContext();

      browserPage = await browserContext.newPage();
    }

    return this;
  }
}
