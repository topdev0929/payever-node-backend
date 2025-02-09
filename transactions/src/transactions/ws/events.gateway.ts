import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { MessageNameEnum } from './enums/message-name.enum';
import { environment } from '../../environments';
import { verify as jwtVerify } from 'jsonwebtoken';
import {
  ConnectPayloadInterface,
  ConnectResponseInterface,
  UpdateStatusPayloadInterface,
  UpdateStatusResponseInterface,
  TransactionUnpackedDetailsInterface,
} from '../interfaces';
import { TransactionActionService, TransactionsService } from '../services';
import { TransactionModel } from '../models';
import { FoldersElasticSearchService } from '@pe/folders-plugin';
import { EsFolderItemInterface } from '@pe/folders-plugin/dist/src/interfaces';
import { EventDispatcher } from '@pe/nest-kit';
import { TransactionEventEnum } from '../enum/events';

@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer() private server: any;

  public constructor(
    private readonly transactionService: TransactionsService,
    private readonly transactionActionService: TransactionActionService,
    private readonly foldersElasticSearchService: FoldersElasticSearchService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @SubscribeMessage(MessageNameEnum.CONNECT)
  public async onConnectEvent(client: WebSocket, payload: ConnectPayloadInterface): Promise<ConnectResponseInterface> {
    return {
      name: MessageNameEnum.CONNECT,
      result: this.verifyToken(payload.token),
    };
  }

  @SubscribeMessage(MessageNameEnum.UPDATE_STATUS)
  public async onUpdateStatusEvent(
    client: WebSocket,
    payload: UpdateStatusPayloadInterface,
  ): Promise<UpdateStatusResponseInterface> {
    const transactionId: string = payload.id;

    const updateStatusResponse: UpdateStatusResponseInterface = {
      id: transactionId,
      name: MessageNameEnum.UPDATE_STATUS,
      result: false,
    };

    if (!this.verifyToken(payload.token)) {
      return updateStatusResponse;
    }

    try {
      const transactionModel: TransactionModel = await this.transactionService.findModelByUuid(transactionId);

      if (!transactionModel) {
        return updateStatusResponse;
      }

      const updatedTransaction: TransactionUnpackedDetailsInterface
        = await this.transactionActionService.updateStatus(transactionModel);

      updateStatusResponse.status = updatedTransaction.status;
      updateStatusResponse.specificStatus = updatedTransaction.specific_status;
      updateStatusResponse.result = true;

      await this.checkTransactionsStatusInESIndex(transactionModel.uuid);
    } catch (error) {
      return updateStatusResponse;
    }

    return updateStatusResponse;
  }

  private verifyToken(token: string): boolean {
    try {
      jwtVerify(token, environment.jwtOptions.secret);
    } catch (e) {
      return false;
    }

    return true;
  }

  private async checkTransactionsStatusInESIndex(transactionId: string): Promise<void> {
    const transactionModel: TransactionModel = await this.transactionService.findModelByUuid(transactionId);
    const esDocuments: EsFolderItemInterface[] =
      await this.foldersElasticSearchService.getDocumentsByServiceEntityId(transactionId);

    let toUpdate: boolean = false;

    for (const esDocumentItem of esDocuments) {
      if (esDocumentItem.status !== transactionModel.status) {
        toUpdate = true;
      }
    }

    if (toUpdate) {
      await this.eventDispatcher.dispatch(
        TransactionEventEnum.TransactionUpdated,
        transactionModel,
        true,
      );
    }

  }

}
