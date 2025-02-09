import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';
import { IntegrationModel } from 'src/integration/models';
import { IntegrationService, TerminalIntegrationSubscriptionService } from '../../integration/services';
import { TerminalModel, TerminalService } from '../../terminal';
import { SetupTerminalInterface } from '../interfaces';
import { DtoConvertPipe } from '@pe/nest-kit';

@Controller()
export class TerminalConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly terminalIntegrationService: TerminalIntegrationSubscriptionService,
    private readonly integrationService: IntegrationService,
    private readonly terminalService: TerminalService,
  ) { }

  @MessagePattern({
    name: 'onboarding.event.setup.terminal',
  })
  public async setupCheckout(data: SetupTerminalInterface): Promise<void> {
    const { businessId, integrationsToInstall }: any = data;
    const business: any = await this.businessService.findOneById(businessId);

    if (!business) {
      await this.addToPending(data);

      return;
    }

    const terminal: TerminalModel = await this.terminalService.findDefaultTerminal(business);

    if (!terminal) {
      await this.addToPending(data);

      return;
    }

    await this.terminalIntegrationService.setupTerminal(data, terminal);
  }

  private async addToPending(data: SetupTerminalInterface): Promise<void> {
    await this.terminalIntegrationService.addPendingInstallation({ businessId: data.businessId, payload: data });
  }
}
