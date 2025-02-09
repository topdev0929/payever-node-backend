import { INestApplicationContext } from '@nestjs/common';
import { loadPackage } from '@nestjs/common/utils/load-package.util';
import { WsAdapter } from '@nestjs/platform-ws';
import { Server } from 'http';

let wsPackage: any = { };

export class CustomWsAdapter extends WsAdapter {

  private readonly port: number = 0;

  constructor(port: number, appOrHttpServer?: INestApplicationContext | Server) {
    super(appOrHttpServer);
    wsPackage = loadPackage('ws', 'WsAdapter');
    this.port = port;
  }

  public create(
    customPort: number,
    options?: any,
  ): any {
    const port: number = customPort === 0
      ? this.port
      : customPort
    ;
    const { server, ...wsOptions }: any = options;

    if (port === 0 && this.httpServer) {
      return this.bindErrorHandler(
        new wsPackage.Server({
          server: this.httpServer,
          ...wsOptions,
        }),
      );
    }

    return server
      ? server
      : this.bindErrorHandler(
        new wsPackage.Server({
          port,
          ...wsOptions,
        }),
      );
  }
}
