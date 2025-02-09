import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ProductRulesService,
  RuleDiscoveryDto,
} from '@pe/products-sdk';
import { MessageBusChannelsEnum } from '../../shared';

@Controller()
export class ProductRulesMessageBusController {
  constructor(private readonly productRulesService: ProductRulesService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'third-party.event.product-rules.created',
  })

  public async productRuleCreated(payloadDto: { rule: RuleDiscoveryDto }): Promise<void> {
    for (const rule of payloadDto.rule.rules) {
      await this.productRulesService.create(rule);
    }
  }
}
