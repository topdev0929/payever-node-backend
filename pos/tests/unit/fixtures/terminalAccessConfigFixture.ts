import { TerminalAccessConfigModel, TerminalModel } from '../../../src/terminal/models';
import { UpdateAccessConfigDto } from '../../../src/terminal/dto';

export class terminalAccessConfigFixture {
  
  public static getUpdateAccessConfigDTO(): UpdateAccessConfigDto {
    return {
      isLive: true,
      isLocked: false,
      internalDomain: '',
      internalDomainPattern: '',
    } as UpdateAccessConfigDto;
  }
  public static getModel(id: string, terminal: TerminalModel): TerminalAccessConfigModel {
    const model: TerminalAccessConfigModel = {
      _id: id,
      id: id,
      isLive: true,
      isLocked: false,
      internalDomain: '',
      internalDomainPattern: '',
      terminal: terminal,
      save: (): void => { },
      toObject: (): void => { },
    } as TerminalAccessConfigModel;
    
    return model;
  }
}
