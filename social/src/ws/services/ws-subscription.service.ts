import { Inject, Injectable } from '@nestjs/common';
import { decode as jwtDecode, verify as jwtVerify } from 'jsonwebtoken';
import * as jsonpack from 'jsonpack';
import { AccessTokenPayload, RolesEnum } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import * as WebSocket from 'ws';
import { environment } from '../../environments';

@Injectable()
export class WsSubscriptionService {
  private clients: { [clientId: string]: WebSocket } = { };
  private postsSubscriptions: { [themeId: string]: string[] } = { };
  private jwtSecret: string;

  constructor(
  ) {
    setInterval(
      () => {
        this.clearDisconnected();
      },
      10 * 1000,
    );
    this.jwtSecret = environment.jwtOptions.jwtSecret;
  }

  public async returnError(key: string, error: any, name: string): Promise<void> {
    for (const clientId of this.findClientForKey(key)) {
      await this.sendMessage(
        clientId,
        {
          data: {
            error: error,
          },
          id: key,
          name: name,
          result: false,
        },
      );
    }
  }

  public verify(token: string, role: RolesEnum = RolesEnum.merchant): boolean {
    try {
      jwtVerify(token, this.jwtSecret);
    } catch (e) {
      return false;
    }

    const user: AccessTokenPayload | null = this.extractDataFromToken(token);

    if (!user) {
      return false;
    }

    switch (true) {
      case role === RolesEnum.merchant:
        const merchantRole: any = user.getRole(RolesEnum.merchant);

        return !!merchantRole;
      case role === RolesEnum.admin:
        return user.isAdmin();
      default:
        return false;
    }
  }

  public saveClient(key: string, clientId: string, client: WebSocket): void {
    if (!this.postsSubscriptions[key]) {
      this.postsSubscriptions[key] = [];
    }

    this.postsSubscriptions[key].push(clientId);
    this.clients[clientId] = client;
  }

  public findClientForKey(key: string): any[] {
    return this.postsSubscriptions[key] || [];
  }

  public async sendMessage(clientId: string, message: any, close: boolean = false): Promise<void> {
    try {
      const client: WebSocket = this.findClient(clientId);
      switch (client.readyState) {
        case client.OPEN:
          client.send(
            JSON.stringify(message),
          );
          break;
        case client.CLOSING:
        case client.CLOSED:
          this.removeClient(clientId);
      }
      if (close) {
        this.removeClient(clientId);
      }
    } catch (e) {
      this.removeClient(clientId);
    }
  }

  private extractDataFromToken(token: string): AccessTokenPayload | null {
    let jwtDecoded: any = jwtDecode(token);

    try {
      jwtDecoded = jsonpack.unpack(jwtDecoded);
    } catch (e) { }

    const userData: any = jwtDecoded ? jwtDecoded.user : null;

    return userData ? plainToClass(AccessTokenPayload, userData) : null;
  }

  private clearDisconnected(): void {
    for (const clientIds in this.postsSubscriptions) {
      if (!this.postsSubscriptions.hasOwnProperty(clientIds)) {
        continue;
      }
      for (const clientId of this.postsSubscriptions[clientIds]) {
        const client: WebSocket = this.findClient(clientId);
        if (client) {
          switch (client.readyState) {
            case client.CLOSING:
            case client.CLOSED:
              this.removeClient(clientId);
              break;
          }
        }
      }
    }
  }

  private removeClient(clientId: string): void {
    delete this.clients[clientId];

    for (const themeClients in this.postsSubscriptions) {
      if (this.postsSubscriptions.hasOwnProperty(themeClients)) {
        continue;
      }
      const index: number = this.postsSubscriptions[themeClients].findIndex((element: string) => element === clientId);
      this.postsSubscriptions[themeClients].splice(index, 1);
    }

  }

  private findClient(clientId: string): WebSocket {
    return this.clients[clientId];
  }
}
