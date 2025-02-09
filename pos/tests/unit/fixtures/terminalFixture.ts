import { CreateTerminalDto, TerminalModel, UpdateTerminalDto } from '../../../src/terminal';
import { businessFixture } from './businessFixture';

export class terminalFixture {
  public static getUpdateDTO(): UpdateTerminalDto {
    return {
      active: true,
      logo: 'updatedTestLogo',
      name: 'updatedTestName',
    } as UpdateTerminalDto;
  }
  public static getCreateDTO(): CreateTerminalDto {
    return {
      logo: 'testLogo',
      name: 'testName',
    } as CreateTerminalDto;
  }
  public static getModelWithoutCollectionsAndStubs(id: string): TerminalModel {
    return {
      _id: id,
      name: 'testName',
      save: (): void => { },
    } as TerminalModel;
  }
  public static getModel(id: string, category: string = null, name: string = 'testName'): TerminalModel {
    const model: TerminalModel = {
      _id: id,
      id: id,
      name: name,
      integrationSubscriptions: [],
      save: (): void => { },
      toObject: (): void => { },
    } as TerminalModel;
    businessFixture.addStubs(model);
    return model;
  }
}
