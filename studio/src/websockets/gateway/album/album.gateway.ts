import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { v4 as uuid } from 'uuid';
import * as WebSocket from 'ws';
import {
  WsCreateAlbumDto,
  WsDuplicateAlbumsDto,
  WsGetAlbumDto,
  WsListAlbumsByMultipleAttributesDto,
  WsListAlbumsByParentDto,
  WsListAlbumsDto,
  WsUpdateAlbumDto,
} from '../../dto';
import { WebsocketMessagesEnum } from '../../enums';
import { FailedConnectResponseInterface, SuccessConnectResponseInterface } from '../../interfaces';
import { WsAlbumService, WsAlbumSubscriptionService } from '../../services';
import { AbstractController, AccessTokenPayload } from '@pe/nest-kit';
import { UserAlbumCreateVoter, UserAlbumUpdateVoter } from '../../../studio/voters';
import { WsListAlbumsByAttributeDto } from '../../dto/album/ws-list-albums-by-attribute.dto';

@WebSocketGateway()
export class AlbumGateway extends AbstractController {
  public constructor(
    private readonly logger: Logger,
    private readonly wsShapeSubscriptionService: WsAlbumSubscriptionService,
    private readonly wsAlbumService: WsAlbumService,
  ) {
    super();
  }

  @SubscribeMessage(WebsocketMessagesEnum.CreateAlbum)
  public async createAlbum(
    client: WebSocket,
    dto: WsCreateAlbumDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.CreateAlbum,
        result: false,
      };
    }

    try {
      const user: AccessTokenPayload = await this.wsShapeSubscriptionService.extractDataFromToken(token);
      await this.denyAccessUnlessGranted(UserAlbumCreateVoter.CREATE, dto.params, user);
    } catch (e) {
      return {
        message: e,
        name: WebsocketMessagesEnum.CreateAlbum,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.createAlbum(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.CreateAlbum,
        result: false,
      };
    }

    return {
      id: id,
      name: WebsocketMessagesEnum.CreateAlbum,
      result: true,
    };
  }

  @SubscribeMessage(WebsocketMessagesEnum.UpdateAlbum)
  public async updateAlbum(
    client: WebSocket,
    dto: WsUpdateAlbumDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.UpdateAlbum,
        result: false,
      };
    }

    try {
      const user: AccessTokenPayload = await this.wsShapeSubscriptionService.extractDataFromToken(token);
      await this.denyAccessUnlessGranted(UserAlbumUpdateVoter.UPDATE, dto.params, user);
    } catch (e) {
      return {
        message: e,
        name: WebsocketMessagesEnum.UpdateAlbum,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.updateAlbum(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.UpdateAlbum,
        result: false,
      };
    }

    return {
      id: id,
      name: WebsocketMessagesEnum.UpdateAlbum,
      result: true,
    };
  }

  @SubscribeMessage(WebsocketMessagesEnum.ListAlbums)
  public async listAlbums(
    client: WebSocket,
    dto: WsListAlbumsDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.ListAlbums,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.listAlbums(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.ListAlbums,
        result: false,
      };
    }
  }

  @SubscribeMessage(WebsocketMessagesEnum.GetAlbum)
  public async getAlbum(
    client: WebSocket,
    dto: WsGetAlbumDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.ListAlbums,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.getAlbum(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.ListAlbums,
        result: false,
      };
    }
  }

  @SubscribeMessage(WebsocketMessagesEnum.DeleteAlbum)
  public async deleteAlbum(
    client: WebSocket,
    dto: WsGetAlbumDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.DeleteAlbum,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.deleteAlbum(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.DeleteAlbum,
        result: false,
      };
    }

    return {
      id: id,
      name: WebsocketMessagesEnum.DeleteAlbum,
      result: true,
    };
  }

  @SubscribeMessage(WebsocketMessagesEnum.GetAlbumsByParent)
  public async getAlbumsByParent(
    client: WebSocket,
    dto: WsListAlbumsByParentDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.GetAlbumsByParent,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.getAlbumsByParent(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.GetAlbumsByParent,
        result: false,
      };
    }
  }

  @SubscribeMessage(WebsocketMessagesEnum.GetAlbumsByAncestor)
  public async getAlbumsByAncestor(
    client: WebSocket,
    dto: WsListAlbumsByParentDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.GetAlbumsByAncestor,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.getAlbumsByAncestor(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.GetAlbumsByAncestor,
        result: false,
      };
    }
  }

  @SubscribeMessage(WebsocketMessagesEnum.GetAlbumsByAttribute)
  public async getAlbumsByAttribute(
    client: WebSocket,
    dto: WsListAlbumsByAttributeDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.GetAlbumsByAttribute,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.getAlbumsByAttribute(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.GetAlbumsByAttribute,
        result: false,
      };
    }
  }

  @SubscribeMessage(WebsocketMessagesEnum.GetAlbumsByMultipleAttributes)
  public async getAlbumsByMultipleAttributes(
    client: WebSocket,
    dto: WsListAlbumsByMultipleAttributesDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.GetAlbumsByMultipleAttributes,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.getAlbumsByMultipleAttributes(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.GetAlbumsByMultipleAttributes,
        result: false,
      };
    }
  }

  @SubscribeMessage(WebsocketMessagesEnum.DuplicateAlbums)
  public async duplicateAlbums(
    client: WebSocket,
    dto: WsDuplicateAlbumsDto,
  ): Promise<SuccessConnectResponseInterface | FailedConnectResponseInterface> {
    const token: string = dto.token;
    if (!(await this.wsShapeSubscriptionService.verify(token))) {
      return {
        name: WebsocketMessagesEnum.GetAlbumsByMultipleAttributes,
        result: false,
      };
    }

    const id: string = dto.id ? dto.id : uuid();
    this.wsShapeSubscriptionService.saveClient(id, id, client);

    try {
      await this.wsAlbumService.duplicateAlbums(dto, id);
    } catch (e) {
      this.logger.log(e);

      return {
        name: WebsocketMessagesEnum.GetAlbumsByMultipleAttributes,
        result: false,
      };
    }
  }
}
