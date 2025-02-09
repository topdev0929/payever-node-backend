import { Injectable } from '@nestjs/common';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { environment } from '../../environments';
import { TerminalAccessConfigService } from './terminal-access-config.service';
import { TerminalService } from './terminal.service';

@Injectable()

export class OnPublishConsumerService {
  constructor(
    private readonly terminalService: TerminalService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
  ) {
  }

  public async publishPosData(terminalId: string, pageIds: string[], version: string): Promise<any> {
    const terminal: TerminalModel = await this.terminalService.findOneById(terminalId);
    if (!terminal) {
      return ;
    }

    await this.terminalAccessConfigService.setLive(terminal);

    const domainNames: string[] = [];
    const terminalAccessConfigModel: TerminalAccessConfigModel
      = await this.terminalAccessConfigService.findByTerminalOrCreate(terminal);
    const accessDomain: string = `${terminalAccessConfigModel.internalDomain}.${environment.posDomain}`;

    domainNames.push(accessDomain);
    const accessConfig: any = {
      id: terminal._id,
      ...terminal.toObject(),
      accessConfig: terminalAccessConfigModel,
    };

    await this.terminalAccessConfigService.update(
      terminal,
      terminalAccessConfigModel,
      {
        version: version,
      },
    );
    accessConfig.accessConfig.version = version;

    return {
      accessConfig,
      domainNames,
    };
  }
}
