import { Injectable } from '@nestjs/common';
import { BusinessModel } from '../../business';
import { IntegrationModel, IntegrationService } from '../../integration';
import { ThirdPartyShippingDataMessageDto } from '../dto/third-party-shipping-data-message.dto';
import { ShippingTaskModel } from '../models/shipping-task.model';
import { ShippingBoxService } from './shipping-box.service';
import { ShippingTaskService } from './shipping-task.service';

@Injectable()
export class OuterProcessService {
  constructor(
    private readonly shippingBoxService: ShippingBoxService,
    private readonly integrationService: IntegrationService,
    private readonly shippingTaskService: ShippingTaskService,
  ) { }

  public async processOuterShippingDataSyncEvent(
    business: BusinessModel,
    integration: IntegrationModel,
    dto: ThirdPartyShippingDataMessageDto,
  ): Promise<void> {
    await this.shippingBoxService.createOrUpdate(dto.shippingBoxes, integration.id);

    if (
      dto.flatAmount !== null
      && dto.flatAmount !== undefined
      && dto.handlingFeePercentage !== undefined
      && dto.handlingFeePercentage !== null
      ) {
        await this.integrationService.update(
          integration.id, 
          {
            flatAmount: dto.flatAmount,
            handlingFeePercentage: dto.handlingFeePercentage,
          },
        );
      }
    
    const tasks: ShippingTaskModel[] = await this.shippingTaskService
      .getByBusinessAndIntegration(business, integration);
    for (const task of tasks) {
      await this.shippingTaskService.taskSuccess(task);
    }
  }
}
