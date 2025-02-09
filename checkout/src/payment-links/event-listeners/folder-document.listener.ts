import { Injectable } from '@nestjs/common';
import { EventListener, EventDispatcher } from '@pe/nest-kit';
import {
  FoldersEventsEnum,
  EsDocumentHookWrapper,
  ElasticFilterBodyInterface,
  EsFolderItemInterface,
} from '@pe/folders-plugin';

import { PaymentLinksEventsEnum } from '../enums';
import { PaymentLinkModel } from '../models';
import { PaymentLinkTransformer } from '../transformers';
import { PaymentLinkFolderItemDto, PaymentLinkResultDto, ListQueryDto } from '../dto';
import { PaymentLinkService } from '../services/payment-link.service';


@Injectable()
export class FolderDocumentListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private readonly paymentLinkService: PaymentLinkService,
  ) { }

  @EventListener(PaymentLinksEventsEnum.paymentLinkCreated)
  public async paymentLinkCreated(
    paymentLink: PaymentLinkModel,
  ): Promise<void> {
    const paymentLinkFolderItemDto: PaymentLinkFolderItemDto =
      PaymentLinkTransformer.paymentLinkModelToPaymentLinkFolderItem(paymentLink);

    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionCreateDocument,
      paymentLinkFolderItemDto,
    );
  }

  @EventListener(PaymentLinksEventsEnum.paymentLinkUpdated)
  public async paymentLinkUpdated(
    paymentLink: PaymentLinkModel,
  ): Promise<void> {
    const paymentLinkFolderItemDto: PaymentLinkFolderItemDto =
      PaymentLinkTransformer.paymentLinkModelToPaymentLinkFolderItem(paymentLink);

    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionUpdateDocument,
      paymentLinkFolderItemDto,
    );
  }

  @EventListener(PaymentLinksEventsEnum.paymentLinkDeleted)
  public async paymentLinkDeleted(
    paymentLinkId: number,
  ): Promise<void> {

  }

  @EventListener(FoldersEventsEnum.ElasticProcessSearchResult)
  public async elasticProcessSearchResult(
    elasticSearchElementDto: EsDocumentHookWrapper<any>,
  ): Promise<void> {
    let redirectUrl: string = '';
    try {
      const paymentLinkResult: PaymentLinkResultDto =
        await this.paymentLinkService.getPaymentLinkResult(elasticSearchElementDto.document.serviceEntityId, false);
      redirectUrl = paymentLinkResult.redirect_url;
    } catch (e) {
    }

    delete elasticSearchElementDto.document.id;
    elasticSearchElementDto.document.paymentLink = redirectUrl;
    elasticSearchElementDto.document.amount = elasticSearchElementDto.document.amount / 100;
  }

  @EventListener(FoldersEventsEnum.ElasticBeforeIndexDocument)
  public async elasticBeforeIndexDocument(
    elasticSearchElementDto: EsDocumentHookWrapper<any>,
  ): Promise<void> {
    const paymentLinkFolderItemDto: PaymentLinkFolderItemDto = elasticSearchElementDto.document;

    paymentLinkFolderItemDto.amount =
      Math.round(paymentLinkFolderItemDto?.amount * 100);

    elasticSearchElementDto.document = paymentLinkFolderItemDto;
  }

  @EventListener(FoldersEventsEnum.ElasticBeforeGetResults)
  public async elasticBeforeGetResults(
    listDto: ListQueryDto,
    filter: ElasticFilterBodyInterface,
  ): Promise<void> {
    filter.must_not.push({ term: { isDeleted: true } });
  }
  
  @EventListener(FoldersEventsEnum.ElasticProcessAllSearchResult)
  public async elasticProcessAllSearchResult(
    elasticSearchResultDto: EsFolderItemInterface[],
  ): Promise<void> {
    elasticSearchResultDto.forEach(item => {
      item.isActive = item.isActive && (!item.expiresAt || new Date(item.expiresAt) >= new Date());
    });
  }
}
