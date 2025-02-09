import { Injectable } from '@nestjs/common';
import { decode as jwtDecode, verify as jwtVerify } from 'jsonwebtoken';
import * as jsonpack from 'jsonpack';
import { AccessTokenPayload, RedisClient, RolesEnum } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import * as dotenv from 'dotenv';
import * as WebSocket from 'ws';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

@Injectable()
export class WsSubscriptionService {
  private clients: { [clientId: string]: WebSocket } = { };
  private themesSubscriptions: { [themeId: string]: string[] } = { };
  private jwtSecret: string = env.JWT_SECRET_TOKEN;

  constructor(
    private readonly client: RedisClient,
    ) { }

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

  public async verify(token: string, role: RolesEnum = RolesEnum.merchant): Promise<boolean> {
    try {
      jwtVerify(token, this.jwtSecret);
    } catch (e) {
      return false;
    }

    const user: AccessTokenPayload = await this.extractDataFromToken(token);
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
    if (!this.themesSubscriptions[key]) {
      this.themesSubscriptions[key] = [];
    }

    this.themesSubscriptions[key].push(clientId);
    this.clients[clientId] = client;
  }

  public findClientForKey(key: string): any[] {
    return this.themesSubscriptions[key] || [];
  }

  public async sendMessage(clientId: string, message: any): Promise<void> {
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
    } catch (e) {
      this.removeClient(clientId);
    }
  }

  public async extractDataFromToken(token: string): Promise<AccessTokenPayload> {
    let jwtDecoded: any = jwtDecode(token);

    try {
      jwtDecoded = jsonpack.unpack(jwtDecoded);
    } catch (e) { }

    if (jwtDecoded && jwtDecoded.user) {
      let user: AccessTokenPayload = plainToClass(AccessTokenPayload, jwtDecoded.user);

      try {
        const redisToken: string = await this.client.get(user.tokenId);
        user = redisToken
          ? plainToClass(AccessTokenPayload, JSON.parse(redisToken))
          : user
        ;
      } catch (e) { }

      return user;
    }

    return null;
  }

  private clearDisconnected(): void {
    for (const clientIds in this.themesSubscriptions) {
      if (!this.themesSubscriptions.hasOwnProperty(clientIds)) {
        continue;
      }
      for (const clientId of this.themesSubscriptions[clientIds]) {
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

    for (const themeClients in this.themesSubscriptions) {
      if (this.themesSubscriptions.hasOwnProperty(themeClients)) {
        continue;
      }
      const index: number = this.themesSubscriptions[themeClients].findIndex((element: string) => element === clientId);
      this.themesSubscriptions[themeClients].splice(index, 1);
    }

  }

  private findClient(clientId: string): WebSocket {
    return this.clients[clientId];
  }
}
