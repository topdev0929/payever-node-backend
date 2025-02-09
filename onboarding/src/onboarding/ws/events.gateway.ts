import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { v4 as uuid } from 'uuid';
import * as WebSocket from 'ws';
import { TaskFormatter } from '../helpers/task-formatter';
import { TaskFormatterResultInterface, JWTInterface } from '../interfaces';
import { ConnectPayloadWSMessageInterface } from '../interfaces/connect-ws-payload.interface';
import { StatusResponseInterface } from '../interfaces/status-response.interface';
import { TaskModel } from '../models';
import { TaskService } from '../services/task.service';
import { MessageNameEnum } from './enums/message-name.enum';
import { JwtHelper } from './helpers/jwt.helper';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() private server: any;
  private clients: Map<string, WebSocket> = new Map<string, WebSocket>();
  private users: Map<string, string[]> = new Map<string, string[]>();

  public constructor(
    private taskService: TaskService,
  ) {
    setInterval(() => {
      this.clearDisconnected(); 
    }, 10 * 1000);
  }

  @SubscribeMessage(MessageNameEnum.CONNECT)
  public async onConnectEvent(
    client: WebSocket,
    payload: ConnectPayloadWSMessageInterface,
  ): Promise<StatusResponseInterface> {
    if (!JwtHelper.verify(payload.token)) {
      return {
        name: MessageNameEnum.CONNECT,
        result: false,
      };
    }

    const token: JWTInterface = JwtHelper.unpack(payload.token);
    const userId: string = token.user.id;
    if (!userId) {
      return {
        name: MessageNameEnum.CONNECT,
        result: false,
      };
    }

    this.saveClient(userId, client);

    const task: TaskModel = await this.taskService.findTasksByUser(userId);
    const taskList: TaskFormatterResultInterface = TaskFormatter.format(task);

    return {
      name: MessageNameEnum.CONNECT,
      result: true,
      task: taskList,
      user: userId,
    };
  }

  @SubscribeMessage(MessageNameEnum.STATUS)
  public async list(client: WebSocket, payload: ConnectPayloadWSMessageInterface): Promise<StatusResponseInterface> {
    if (!JwtHelper.verify(payload.token)) {
      return {
        name: MessageNameEnum.STATUS,
        result: false,
      };
    }

    const token: JWTInterface = JwtHelper.unpack(payload.token);
    const userId: string = token.user.id;
    if (!userId) {
      return {
        name: MessageNameEnum.STATUS,
        result: false,
      };
    }

    const task: TaskModel = await this.taskService.findTasksByUser(userId);
    const taskList: TaskFormatterResultInterface = TaskFormatter.format(task);

    return {
      name: MessageNameEnum.STATUS,
      result: true,
      task: taskList,
    };
  }

  public async send(task: TaskModel): Promise<void> {
    const userClientIds: string[] = this.users.get(task.user.id);
    if (!userClientIds || !userClientIds.length) {
      return;
    }

    const taskList: TaskFormatterResultInterface = TaskFormatter.format(task);

    for (const clientId of userClientIds) {
      try {
        const client: WebSocket = this.clients.get(clientId);
        switch (client.readyState) {
          case client.OPEN:
            client.send(
              JSON.stringify({
                name: MessageNameEnum.STATUS,
                result: true,
                task: taskList,
              }),
            );
            break;
          case client.CLOSING:
          case client.CLOSED:
            this.removeClient(clientId);
        }
      } catch (e) {
        this.removeClient(clientId);
      }
    }
  }

  private clearDisconnected(): void {
    for (const [clientId, client] of this.clients) {
      switch (client.readyState) {
        case client.CLOSING:
        case client.CLOSED:
          this.removeClient(clientId);
          break;
      }
    }
  }

  private saveClient(userId: string, client: WebSocket): void {
    const clientId: string = uuid();
    this.clients.set(clientId, client);

    let userClients: string[] = this.users.get(userId);
    if (!userClients) {
      userClients = [clientId];
    } else {
      userClients.push(clientId);
    }

    this.users.set(userId, userClients);
  }

  private removeClient(clientId: string): void {
    if (this.clients.get(clientId)) {
      this.clients.delete(clientId);
    }
  }
}
