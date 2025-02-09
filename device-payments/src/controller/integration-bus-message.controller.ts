import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConnectPayloadDto } from '../dto';
import { RabbitMessagesEnum } from '../enum';
import { BusinessModel } from '../interfaces';
import { BusinessSchemaName } from '../schemas';

@Controller()
export class IntegrationBusMessageController {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
  ) { }

  @MessagePattern({
    name: RabbitMessagesEnum.ConnectThirdPartyEnabled,
  })
  public async onDevicePaymentsConnected(data: ConnectPayloadDto): Promise<void> {
    return this.switchBusinessAvailability(data, true);
  }

  @MessagePattern({
    name: RabbitMessagesEnum.ConnectThirdPartyDisabled,
  })
  public async onDevicePaymentsDisconnected(data: ConnectPayloadDto): Promise<void> {
    return this.switchBusinessAvailability(data, false);
  }

  private async switchBusinessAvailability(
    data: ConnectPayloadDto,
    enabled: boolean,
  ): Promise<void> {
    if (data.name === 'device-payments') {
      await this.businessModel.updateOne(
        { _id: data.businessId },
        {
          $set: {
            businessId: data.businessId,
            'settings.enabled': enabled,
          },
        },
        {
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
    }
  }
}
