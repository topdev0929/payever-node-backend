import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventDispatcher } from '@pe/nest-kit';
import { BuilderIntegrationDto } from '../dto';
import { IntegrationEventEnum } from '../enums';

@Controller('builder/integration')
@ApiTags('Builder Integration')
export class BuilderIntegrationController {
  constructor(
    private readonly dispatcher: EventDispatcher,
  ) { }

  @Post(`channel-shipping-method`)
  public async channelSetShippingMethod(
    @Body() dto: BuilderIntegrationDto,
  ): Promise<any> {
    const result: any[] = await this.dispatcher.dispatch(IntegrationEventEnum.getShippingMethod, dto);

    return result[0];
  }
}
