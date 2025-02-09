import { INestApplication, Logger } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { CucumberOptionsInterface, ProviderInterface } from '@pe/cucumber-sdk';
import { SocketIoEmitterService } from '../../src/message';

export const SOCKET_IO_EMITTER_PROVIDER_NAME: string = 'SocketIoEmitterProvider';

export class SocketIoEmitterProvider implements ProviderInterface{
  protected application: INestApplication;
  protected logger: Logger;
  protected emitter: any;

  public constructor(
    protected options: CucumberOptionsInterface,
  ) { }

  public async configure(
    builder: TestingModuleBuilder,
  ): Promise<void> {
    const servers = { chat: null, ws: null };
    const sockets: Map<string, any> = new Map();

    this.emitter = {
      servers,
      of: (namespace: string): any => {
        const server = this.emitter?.servers[namespace];
        if (!server) {
          throw new Error(`namespace '${namespace}' not initialized`);
        }

        return server;
      },
      to: (room: string): any => { throw new Error(`cannot invoke 'to' directly`) },
      emit: (event: string, ...args: any[]): any => { throw new Error(`cannot invoke 'emit' directly`); },
      addSocket: (socket: any): void => { sockets.set(socket.id, socket); },
      removeSocket: (socketId: string): void => { sockets.delete(socketId); },
      getSocket: (socketId: string): any => { return sockets.get(socketId); }
    };
    builder.overrideProvider(SocketIoEmitterService).useValue(this.emitter);
  }

  public async setup(application: INestApplication, logger: Logger): Promise<void> {
    this.application = application;
    this.logger = logger;
  }

  public async close(): Promise<void> {
    this.emitter = null;
  }

  public getName(): string {
    return SOCKET_IO_EMITTER_PROVIDER_NAME;
  }
}
