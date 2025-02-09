import { Controller, Logger } from '@nestjs/common';
import { TerminalService } from '../services';
import { MessagePattern } from '@nestjs/microservices';
import { TerminalModel } from '../models';
import { EventApplicationProducer, TerminalRabbitEventsProducer } from '../producers';

@Controller()
export class DeleteNonInternalBusinessConsumer {
  constructor(
    private readonly terminalService: TerminalService,
    private readonly terminalEventsProducer: TerminalRabbitEventsProducer,
    private readonly eventApplicationProducer: EventApplicationProducer,
    private readonly logger: Logger,
  ) { }


  @MessagePattern({
    name: 'auth.event.non.internal.business.export',
  })
  /* tslint:disable-next-line:no-ignored-initial-value */
  public async nonInternalBusiness(data: any): Promise<void> {
    // todo: takedown, will be open occasionally when needed
    return ;
    if (
      process.env.KUBERNETES_INGRESS_NAMESPACE &&
      ['test', 'staging'].includes(process.env.KUBERNETES_INGRESS_NAMESPACE)
    ) {
      const terminals: TerminalModel[] = await this.terminalService.findByBusinessIds(data.businessIds);

      for (const terminal of terminals) {
        this.logger.log(`Deleting data on terminal ${terminal._id}`);
        const removed: boolean = await this.terminalService.removeInBusiness(terminal.business, terminal, true);
        if (removed) {
          await this.terminalEventsProducer.terminalRemoved(terminal.business, terminal);
          await this.eventApplicationProducer.produceApplicationRemovedEvent(terminal);
        }
      }
    }
    if (global.gc) { global.gc(); }
  }
}

