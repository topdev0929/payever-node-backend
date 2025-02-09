import { CommonDataEventProducer } from '../producer';
import { CommonModelsNamesEnum, CurrencyEventsEnum, CurrencyModel } from '@pe/common-sdk';
import { EventListener } from '@pe/nest-kit';

export class CurrencyEventsListener {
  constructor(
    private readonly eventProducer: CommonDataEventProducer,
  ) { }

  @EventListener(CurrencyEventsEnum.RateUpdated)
  public async handleRateUpdated(originalModel: CurrencyModel, updatedModel: CurrencyModel): Promise<void> {
    if (originalModel.rate !== updatedModel.rate) {
      await this.eventProducer.produceUpdateEvent(CommonModelsNamesEnum.CurrencyModel, updatedModel);
    }
  }
}
