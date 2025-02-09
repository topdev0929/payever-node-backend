import { CompiledThemeModel } from '../../../src/templating/models';
import { PebContextSchema } from '../../../src/templating/interfaces/builder-types';
import { TemplateDataInterface, RoutingInterface } from '../../../src/templating/interfaces';

export class compiledThemeFixture {
  
  public static getCreateDTO(): any {
    return {
      context: { },
      data: {
        "page": "/page/:pageId",
      },
      routing: {
        "/": "pId",
      },
      blogId: 'sId',
      blog: 'tId',
    } as any;
  }
  public static getModel(id: string,
    context: PebContextSchema,
    data: TemplateDataInterface,
    routing: RoutingInterface,
    blog: string,
  ): CompiledThemeModel {
    const model: CompiledThemeModel = {
      _id: id,
      id: id,
      context: context,
      data: data,
      routing: routing,
      blog: blog,
      save: (): void => { },
      toObject: (): void => { },
    } as CompiledThemeModel;
    
    return model;
  }
}
