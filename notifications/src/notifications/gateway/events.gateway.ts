/* tslint:disable:cognitive-complexity */
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { verify as jwtVerify } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import * as WebSocket from 'ws';
import { environment } from '../../environments';
import { MessageNameEnum } from '../enums/message-name.enum';
import { ConnectPayloadInterface } from '../interfaces/connect-payload.interface';
import { ConnectResponseInterface } from '../interfaces/connect-response.interface';
import { DeletePayloadInterface } from '../interfaces/delete-payload.interface';
import { DeleteResponseInterface } from '../interfaces/delete-response.interface';
import { NotificationsCanceledPayloadInterface } from '../interfaces/notifications-canceled-payload.interface';
import { NotificationsCanceledResponseInterface } from '../interfaces/notifications-canceled-response.interface';
import { NotificationsResponseInterface } from '../interfaces/notifications-response.interface';
import { NotificationModel } from '../models/notification.model';
import { NotificationService } from '../services';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() private server: any;
  private clients: WebSocket[] = [];
  private taggedList: any[] = [];

  public constructor(
    private notificationService: NotificationService,
    // private jwtStrategy: JwtStrategy,
    // private compressionService: CompressionService,
  ) {
    setInterval(() => { this.clearDisconnected(); }, 10 * 1000);
  }

  @SubscribeMessage(MessageNameEnum.EVENT_CONNECTION)
  public async onConnectEvent(client: WebSocket, payload: ConnectPayloadInterface): Promise<ConnectResponseInterface> {
    const token: string = payload.token;
    if (!this.verify(token)) {
      return {
        name: MessageNameEnum.EVENT_CONNECTION,
        result: false,
      };
    }

    const id: string = payload.id ? payload.id : uuid();
    this.saveClient(payload, id, client);

    return {
      id: id,
      name: MessageNameEnum.EVENT_CONNECTION,
      result: true,
    };
  }

  @SubscribeMessage(MessageNameEnum.GET_NOTIFICATIONS)
  public async list(client: WebSocket, payload: ConnectPayloadInterface): Promise<NotificationsResponseInterface> {
    const token: string = payload.token;
    if (!this.verify(token)) {
      return {
        name: MessageNameEnum.GET_NOTIFICATIONS,
        result: false,
      };
    }

    const notifications: NotificationModel[] =
      await this.notificationService.findNotifications(
        payload.kind,
        payload.entity,
        payload.app,
      );

    const total: number =
      await this.notificationService.countNotifications(
        payload.kind,
        payload.entity,
        payload.app,
      );

    return {
      name: MessageNameEnum.GET_NOTIFICATIONS,
      notifications: notifications,
      result: true,
      total: total,
    };
  }

  @SubscribeMessage(MessageNameEnum.DELETE_NOTIFICATION)
  public async delete(client: WebSocket, payload: DeletePayloadInterface): Promise<DeleteResponseInterface> {
    const token: string = payload.token;
    if (!this.verify(token)) {
      return {
        name: MessageNameEnum.DELETE_NOTIFICATION,
        result: false,
      };
    }

    await this.notificationService.deleteOneById(payload.id);

    return {
      id: payload.id,
      name: MessageNameEnum.DELETE_NOTIFICATION,
      result: true,
    };
  }

  @SubscribeMessage(MessageNameEnum.NOTIFICATIONS_CANCELED)
  public async notificationsCanceled(
    client: WebSocket,
    payload: NotificationsCanceledPayloadInterface,
  ): Promise<NotificationsCanceledResponseInterface> {
    const token: string = payload.token;
    if (!this.verify(token)) {
      return {
        name: MessageNameEnum.NOTIFICATIONS_CANCELED,
        result: false,
      };
    }

    return {
      ids: payload.ids,
      name: MessageNameEnum.NOTIFICATIONS_CANCELED,
      result: true,
    };
  }

  public async send(notification: NotificationModel): Promise<void> {
    if (await this.notificationService.isCommonNotification(notification.app)) {
      const entityApps: any[] = this.findEntityList(notification);
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (const app in entityApps) {
        if (entityApps.hasOwnProperty(app)) {
          this.applicationSend(notification, app);
        }
      }
    } else {
      const apps: string[] = await this.notificationService.collectAppsForNotification(notification.app);
      for (const app of apps) {
        this.applicationSend(notification, app);
      }
    }
  }

  public applicationSend(notification: NotificationModel, app: string): void {
    const clientsIds: any[] = Object.assign([], this.findTaggedList(notification, app));
    if (!clientsIds.length) {
      return;
    }

    for (const clientId of clientsIds) {
      try {
        const client: WebSocket = this.findClient(clientId);
        switch (client.readyState) {
          case client.OPEN:
            client.send(
              JSON.stringify({
                name: MessageNameEnum.GET_NOTIFICATIONS,
                notifications: [notification],
                result: true,
              }),
            );
            break;
          case client.CLOSING:
          case client.CLOSED:
            this.removeClientByNotification(notification, app, clientId);
        }
      } catch (e) {
        this.removeClientByNotification(notification, app, clientId);
      }
    }
  }

  public async emit(action: MessageNameEnum, payload: any): Promise<void> {
    await this.server.emit(action, payload);
  }

  private clearDisconnected(): void {
    const taggedList: any[] = this.taggedList;
    // eslint-disable-next-line @typescript-eslint/no-for-in-array
    for (const kind in taggedList) {
      if (taggedList.hasOwnProperty(kind)) {
        for (const entity in taggedList[kind]) {
          if (taggedList[kind].hasOwnProperty(entity)) {
            for (const app in taggedList[kind][entity]) {
              if (taggedList[kind][entity].hasOwnProperty(app)) {
                const clientIds: string[] = Object.assign([], taggedList[kind][entity][app]);
                for (const clientId of clientIds) {
                  const client: WebSocket = this.findClient(clientId);
                  switch (client.readyState) {
                    case client.CLOSING:
                    case client.CLOSED:
                      this.removeClient(kind, entity, app, clientId);
                      break;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private verify(token: string): boolean {
    try {
      jwtVerify(token, environment.jwtOptions.secret);
    } catch (e) {
      return false;
    }

    return true;
  }

  private saveClient(payload: ConnectPayloadInterface, clientId: string, client: WebSocket): void {
    if (!this.taggedList[payload.kind]) {
      this.taggedList[payload.kind] = [];
    }
    if (!this.taggedList[payload.kind][payload.entity]) {
      this.taggedList[payload.kind][payload.entity] = [];
    }
    if (!this.taggedList[payload.kind][payload.entity][payload.app]) {
      this.taggedList[payload.kind][payload.entity][payload.app] = [];
    }
    if (!this.taggedList[payload.kind][payload.entity][payload.app].includes(clientId)) {
      this.taggedList[payload.kind][payload.entity][payload.app].push(clientId);
    }
    this.clients[clientId] = client;
  }

  private removeClientByNotification(notification: NotificationModel, app: string, clientId: string): void {
    this.removeClient(notification.kind, notification.entity, app, clientId);
  }

  private removeClient(kind: string, entity: string, app: string, clientId: string): void {
    const indexClient: number = this.clients.findIndex((element: string) => element === clientId);
    this.clients.splice(indexClient, 1);

    const index: number = this.taggedList[kind][entity][app].findIndex((element: string) => element === clientId);
    this.taggedList[kind][entity][app].splice(index, 1);
  }

  private findClient(clientId: string): WebSocket {
    return this.clients[clientId];
  }

  private findTaggedList(notification: NotificationModel, app: string): any[] {
    if (this.taggedList[notification.kind]
      && this.taggedList[notification.kind][notification.entity]
      && this.taggedList[notification.kind][notification.entity][app]
    ) {
      return this.taggedList[notification.kind][notification.entity][app];
    }

    return [];
  }

  private findEntityList(notification: NotificationModel): any[] {
    if (this.taggedList[notification.kind]
      && this.taggedList[notification.kind][notification.entity]
    ) {
      return this.taggedList[notification.kind][notification.entity];
    }

    return [];
  }

  // private async unpack(token: string): Promise<boolean> {
  //   const result = jwtVerify(token, environment.jwtOptions.secret);
  //   const jwtDecoded = jwtDecode(token);
  //
  //   console.log(jwtDecoded);
  //
  //   const tokenPayload: TokenPayloadDto =
  //     plainToClass<TokenPayloadDto, {}>(
  //       TokenPayloadDto,
  //       jwtDecoded,
  //     );
  //
  //   const payload: TokenPayloadDto = CompressionService.decompress(tokenPayload.user);
  //
  //   return true;
  // }
}
