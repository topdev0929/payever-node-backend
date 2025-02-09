import {
  Inject,
  forwardRef,
  Logger,
  Injectable,
  UsePipes,
  ValidationPipe,
  ValidationError,
  UseFilters,
} from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidationPipeObject } from '@pe/nest-kit';
import { WidgetWsService } from './widget.service';
import { SocketWithToken } from '../interfaces/ws-socket-local.interface';
import { WsExceptionsFilter } from '../filters';

@Injectable()
@UsePipes(new ValidationPipe(ValidationPipeObject({
  exceptionFactory: (errors: ValidationError[]) => new WsException(errors),
})))
@UseFilters(new WsExceptionsFilter())
@WebSocketGateway({
  namespace: '/widget',
  path: '/ws/',
  transports: ['websocket'],
})
export class WidgetWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  constructor(
    private logger: Logger,
    @Inject(forwardRef(() => WidgetWsService)) private widgetWsService: WidgetWsService,
  ) { }

  public afterInit(server: Server): void {
    this.logger.log(`Widget Ws Init`);
  }

  public async handleConnection(socket: SocketWithToken): Promise<void> {
    try {
      await this.widgetWsService.handleConnectionEvent(socket);
    } catch (ex) {
      socket.emit('exception', ex.message);
      socket.disconnect();
    }
  }

  public async handleDisconnect(socket: SocketWithToken): Promise<void> {
    await this.widgetWsService.handleDisconnectEvent(socket);
  }
}
