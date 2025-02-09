import { Injectable, Logger } from '@nestjs/common';
import {
  WsCreateAlbumDto, WsDuplicateAlbumsDto,
  WsGetAlbumDto,
  WsListAlbumsByMultipleAttributesDto,
  WsListAlbumsByParentDto,
  WsListAlbumsDto,
  WsUpdateAlbumDto,
} from '../../dto';
import { AbstractController, AccessTokenPayload, EventDispatcher, EventListener } from '@pe/nest-kit';
import { WebsocketMessagesEnum } from '../../enums';
import { WsAlbumSubscriptionService } from './ws-album-subscription.service';
import { UserAlbumService } from '../../../studio/services';
import { UserAlbumModel } from '../../../studio/models';
import { BusinessService } from '../../../business/services';
import { BusinessModel } from '../../../business/models';
import { UserAlbumReadVoter, UserAlbumRemoveVoter } from '../../../studio/voters';
import { WsListAlbumsByAttributeDto } from '../../dto/album/ws-list-albums-by-attribute.dto';

@Injectable()
export class WsAlbumService  extends AbstractController {
  constructor(
    private readonly logger: Logger,
    private readonly userAlbumService: UserAlbumService,
    private readonly businessService: BusinessService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly wsShapeSubscriptionService: WsAlbumSubscriptionService,
  ) {
    super();
  }

  public async createAlbum(dto: WsCreateAlbumDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.CreateAlbum, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.CreateAlbum)
  public async createAlbumDto(dto: WsCreateAlbumDto, key: string): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const album: UserAlbumModel = await this.userAlbumService.create(business, dto.params);
      await this.wsShapeSubscriptionService.returnAlbum(key, album, WebsocketMessagesEnum.CreateAlbum);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.CreateAlbum);
    }
  }

  public async updateAlbum(dto: WsUpdateAlbumDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.UpdateAlbum, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.UpdateAlbum)
  public async updateAlbumDto(dto: WsUpdateAlbumDto, key: string): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const album: UserAlbumModel = await this.userAlbumService.update(dto.params.albumId, business, dto.params);
      await this.wsShapeSubscriptionService.returnAlbum(key, album, WebsocketMessagesEnum.UpdateAlbum);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.UpdateAlbum);
    }
  }

  public async listAlbums(dto: WsListAlbumsDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.ListAlbums, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.ListAlbums)
  public async listAlbumsBackground(dto: WsListAlbumsDto, key: string): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const albums: UserAlbumModel[] = await this.userAlbumService.findAllParentByBusinessId(business);
      await this.wsShapeSubscriptionService.returnAlbums(key, albums, WebsocketMessagesEnum.ListAlbums);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.ListAlbums);
    }
  }

  public async getAlbum(dto: WsGetAlbumDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.GetAlbum, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.GetAlbum)
  public async getAlbumBackground(dto: WsGetAlbumDto, key: string): Promise<void> {
    try {
      const user: AccessTokenPayload = await this.wsShapeSubscriptionService.extractDataFromToken(dto.token);
      const album: UserAlbumModel = await this.userAlbumService.findById(dto.params.albumId);
      await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, album, user);
      await this.wsShapeSubscriptionService.returnAlbum(key, album, WebsocketMessagesEnum.GetAlbum);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.GetAlbum);
    }
  }

  public async deleteAlbum(dto: WsGetAlbumDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.DeleteAlbum, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.DeleteAlbum)
  public async deleteAlbumBackground(dto: WsGetAlbumDto, key: string): Promise<void> {
    try {
      const user: AccessTokenPayload = await this.wsShapeSubscriptionService.extractDataFromToken(dto.token);
      const album: UserAlbumModel = await this.userAlbumService.findById(dto.params.albumId);
      await this.denyAccessUnlessGranted(UserAlbumRemoveVoter.REMOVE, album, user);
      await this.userAlbumService.remove(album);
      await this.wsShapeSubscriptionService.returnAlbum(key, null, WebsocketMessagesEnum.DeleteAlbum);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.DeleteAlbum);
    }
  }

  public async duplicateAlbums(dto: WsDuplicateAlbumsDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.DuplicateAlbums, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.DuplicateAlbums)
  public async duplicateAlbumsBackground(
    dto: WsDuplicateAlbumsDto,
    key: string,
  ): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const albums: UserAlbumModel[] = await this.userAlbumService.duplicateAlbums(
        business,
        dto.params,
      );
      await this.wsShapeSubscriptionService.returnAlbums(
        key,
        albums,
        WebsocketMessagesEnum.DuplicateAlbums,
      );
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.DuplicateAlbums);
    }
  }

  public async getAlbumsByParent(dto: WsListAlbumsByParentDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.GetAlbumsByParent, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.GetAlbumsByParent)
  public async getAlbumsByParentBackground(dto: WsListAlbumsByParentDto, key: string): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const user: AccessTokenPayload = await this.wsShapeSubscriptionService.extractDataFromToken(dto.token);
      const album: UserAlbumModel = await this.userAlbumService.findById(dto.params.albumId);
      await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, album, user);
      const albums: UserAlbumModel[] = await this.userAlbumService.findByBusinessId(
        dto.params.pagination,
        business,
        album.id,
      );
      await this.wsShapeSubscriptionService.returnAlbums(key, albums, WebsocketMessagesEnum.GetAlbumsByParent);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.GetAlbumsByParent);
    }
  }

  public async getAlbumsByAncestor(dto: WsListAlbumsByParentDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.GetAlbumsByAncestor, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.GetAlbumsByAncestor)
  public async getAlbumsByAncestorBackground(dto: WsListAlbumsByParentDto, key: string): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const user: AccessTokenPayload = await this.wsShapeSubscriptionService.extractDataFromToken(dto.token);
      const album: UserAlbumModel = await this.userAlbumService.findById(dto.params.albumId);
      await this.denyAccessUnlessGranted(UserAlbumReadVoter.READ, album, user);
      const albums: UserAlbumModel[] = await this.userAlbumService.findByBusinessIdAndAncestor(
        dto.params.pagination,
        business,
        album.id,
      );
      await this.wsShapeSubscriptionService.returnAlbums(key, albums, WebsocketMessagesEnum.GetAlbumsByAncestor);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.GetAlbumsByAncestor);
    }
  }

  public async getAlbumsByAttribute(dto: WsListAlbumsByAttributeDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.GetAlbumsByAttribute, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.GetAlbumsByAttribute)
  public async getAlbumsByAttributeBackground(dto: WsListAlbumsByAttributeDto, key: string): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const albums: UserAlbumModel[] = await this.userAlbumService.findByUserAttribute(
        dto.params.pagination,
        business,
        dto.params.attributeId,
        dto.params.attributeValue,
      );
      await this.wsShapeSubscriptionService.returnAlbums(key, albums, WebsocketMessagesEnum.GetAlbumsByAttribute);
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.GetAlbumsByAttribute);
    }
  }

  public async getAlbumsByMultipleAttributes(dto: WsListAlbumsByMultipleAttributesDto, key: string): Promise<void> {
    this.eventDispatcher.dispatch(WebsocketMessagesEnum.GetAlbumsByMultipleAttributes, dto, key).catch();
  }

  @EventListener(WebsocketMessagesEnum.GetAlbumsByMultipleAttributes)
  public async getAlbumsByMultipleAttributesBackground(
    dto: WsListAlbumsByMultipleAttributesDto,
    key: string,
  ): Promise<void> {
    try {
      const business: BusinessModel = await this.businessService.findOneById(dto.params.businessId);
      const albums: UserAlbumModel[] = await this.userAlbumService.findByMultipleUserAttributes(
        dto.params.pagination,
        business,
        dto.params,
      );
      await this.wsShapeSubscriptionService.returnAlbums(
        key,
        albums,
        WebsocketMessagesEnum.GetAlbumsByMultipleAttributes,
      );
    } catch (e) {
      this.logger.log(e);
      await this.wsShapeSubscriptionService.returnError(key, e, WebsocketMessagesEnum.GetAlbumsByMultipleAttributes);
    }
  }
}
