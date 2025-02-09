import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { verify as jwtVerify } from 'jsonwebtoken';
import { Server } from 'socket.io';
import { EventMessageNameEnum, WidgetSettingTypeEnum } from '../enums';
import { environment } from '../../environments';
import {
  ConnectPayloadInterface,
  ConnectResponseInterface,
  GetDataPayloadInterface,
  GetDataResponseInterface,
  TokenPayloadWsInterface,
} from '../interfaces';
import { StatisticsService, WidgetService } from '../services';
import { WidgetModel } from '../models';

import { RedisClient, UserTokenInterface } from '@pe/nest-kit';

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  public wsClients: any = [];

  private logger: Logger = new Logger('Cube Data', true);

  @WebSocketServer() private server: Server;

  public constructor(
    private readonly statisticsService: StatisticsService,
    private readonly widgetService: WidgetService,
    private readonly redisClient: RedisClient,
  ) { }

  public handleConnection(client: any): void {
    this.wsClients.push(client);
  }

  public handleDisconnect(client: any): void {
    for (let i: number = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
  }

  public broadcast(event: string, message: any): void {
    const broadCastMessage: string = JSON.stringify(message);
    for (const c of this.wsClients) {
      c.send(event, broadCastMessage);
    }
  }

  @SubscribeMessage(EventMessageNameEnum.EVENT_CONNECTION)
  public async onConnectEvent(client: WebSocket, payload: ConnectPayloadInterface): Promise<ConnectResponseInterface> {
    const tokenData = this.verifyToken(payload.token);

    return {
      name: EventMessageNameEnum.EVENT_CONNECTION,
      result: tokenData.result,
    };
  }

  @SubscribeMessage(EventMessageNameEnum.GET_DATA)
  public async onGetDataEvent(client: WebSocket, payload: GetDataPayloadInterface): Promise<GetDataResponseInterface> {
    const token: string = payload.token;

    const tokenData: TokenPayloadWsInterface = this.verifyToken(token);

    if (!tokenData.result) {
      return {
        name: EventMessageNameEnum.GET_DATA,
        result: false,
        useCache: false,
      };
    }

    const widget: WidgetModel = await this.widgetService.findOneById(payload.widgetId);

    if (!widget) {
      return {
        error: 'Widget does not exist.',
        name: EventMessageNameEnum.GET_DATA,
        result: false,
        widgetId: payload.widgetId,
        useCache: false,
      };
    }    

    const defaultData: any = widget.widgetSettings.map(row => {

      return row.map(cell => {
        const text: string = this.widgetService.resolveSetting(cell, WidgetSettingTypeEnum.Text);
        if (text || text === '' || !cell.length) {

          return text ?? null;
        } else {

          return 0;
        }
      });
    });

    try {
      
      const businessId: string = tokenData.data.tokenId.split('|')[1];
      const redisKey: string = `${businessId}-${payload.widgetId}`;

      try {
        const dataCache: string | null = await this.redisClient.get(redisKey);
        const payloadRes: GetDataResponseInterface = {
          data: JSON.parse(dataCache),
          name: EventMessageNameEnum.GET_DATA,
          result: true,
          widgetId: payload.widgetId,
          useCache: true,
          defaultData: dataCache ? null : defaultData,
        };

        client.send(JSON.stringify(payloadRes));
      } catch (error) {        

        client.send(JSON.stringify({
          data: null,
          name: EventMessageNameEnum.GET_DATA,
          result: true,
          widgetId: payload.widgetId,
          useCache: true,
          defaultData: defaultData,
        }));

        this.logger.warn(`Failed to read from cache for widget by id ${payload.widgetId}.`);
      }

      const data: any = await this.statisticsService.getData(widget);

      try {
        const expiration: number = 2 * 60 * 60;
        await this.redisClient.set(redisKey, JSON.stringify(data), 'EX', expiration);
      } catch (error) {
        this.logger.warn(`Write to cache failed for widget by id ${payload.widgetId}.`);
      }

      return {
        data,
        name: EventMessageNameEnum.GET_DATA,
        result: true,
        widgetId: payload.widgetId,
        useCache: false,
      };
    } catch (e) {
      return {
        error: e.message,
        name: EventMessageNameEnum.GET_DATA,
        result: false,
        widgetId: payload.widgetId,
        useCache: false,
        defaultData,
      };
    }
  }

  private verifyToken(token: string): TokenPayloadWsInterface {
    try {
      const data: any = jwtVerify(token, environment.jwtOptions.secret);

      return {
        result: true,
        data: data.user as UserTokenInterface,
      };
    } catch (e) {

      return {
        result: false,
      };
    }
  }
}
