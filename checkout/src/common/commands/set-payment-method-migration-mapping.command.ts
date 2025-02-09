import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { PaymentMethodMigrationMappingService } from '../services';
import { PaymentMethodMigrationMappingModel } from '../models';

@Injectable()
export class SetPaymentMethodMigrationMappingCommand {
  constructor(
    private readonly paymentMethodMigrationMappingService: PaymentMethodMigrationMappingService,
  ) { }

  @Command(
    {
      command:
        'checkout:migration-mapping:set [--payment_method_from] ' +
        '[--payment_method_to] [--business_id] [--enabled=true]',
      describe: 'Sets payment method migration mapping',
    },
  )
  public async export(
    @Option({ name: 'payment_method_from' }) paymentMethodFrom?: string,
    @Option({ name: 'payment_method_to' }) paymentMethodTo?: string,
    @Option({ name: 'business_id' }) businessId: string = null,
    @Option({ name: 'enabled' }) enabled: boolean = true,
  ): Promise<void> {
    if (!paymentMethodFrom && !paymentMethodTo) {
      Logger.error('Both "payment_method_from" and "payment_method_to" are required');

      return;
    }

    if (typeof enabled === 'string') {
      enabled = enabled === 'true';
    }

    Logger.log(`Starting payment method mapping command`);

    const existingMigrationMapping: PaymentMethodMigrationMappingModel =
      await this.paymentMethodMigrationMappingService.findPaymentMethodMappingForBusiness(
        paymentMethodFrom,
        paymentMethodTo,
        businessId,
      );

    if (existingMigrationMapping) {
      Logger.log(`Found existing entry, current values are: ${JSON.stringify(existingMigrationMapping, null, 2)}`);
      if (enabled) {
        await this.paymentMethodMigrationMappingService.enablePaymentMethodMapping(existingMigrationMapping);
        Logger.log(`Existing mapping was successfully enabled`);
      } else {
        await this.paymentMethodMigrationMappingService.disablePaymentMethodMapping(existingMigrationMapping);
        Logger.log(`Existing mapping was successfully disabled`);
      }

      return;
    }

    const createdMigrationMapping: PaymentMethodMigrationMappingModel =
      await this.paymentMethodMigrationMappingService.createPaymentMethodMapping(
        paymentMethodFrom,
        paymentMethodTo,
        businessId,
        enabled,
      );

    Logger.log(`New mapping was successfully created, values are: ${JSON.stringify(createdMigrationMapping, null, 2)}`);
  }
}
