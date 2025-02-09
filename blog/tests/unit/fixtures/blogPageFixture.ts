import { BlogPageModel } from '../../../src/templating/models';
import { PebContextSchema, PebStylesheet, PebTemplate } from '../../../src/templating/interfaces/builder-types';
import { PageDataInterface, CompiledThemeInterface, BlogPageInterface } from '../../../src/templating/interfaces';
import { PebPageVariant, PebElementType } from '../../../src/templating/enums';

export class blogPageFixture {
  
  public static getCreateDTO(compiledTheme: CompiledThemeInterface): BlogPageInterface {
    return {
      compiledTheme: compiledTheme,
      context: { },
      data: {
        "page": "/page/:pageId",
      },      
      name: "page 1",
      blog: "tId",
      stylesheets: {
        "desktop": {
        }
      },
      template: {
        id: "teId",
        type: PebElementType.Document,
      },
      variant: PebPageVariant.Front,
    } as BlogPageInterface;
  }
  public static getModel(
    id: string,
    data: PageDataInterface,
    compiledTheme: CompiledThemeInterface,
    context: PebContextSchema,
    name: string,
    blog: string,
    stylesheets: {
      [screen: string]: PebStylesheet,
    },
    template: PebTemplate,
    variant: PebPageVariant,
  ): BlogPageModel {
    const model: BlogPageModel = {
      _id: id,
      id: id,
      data: data,
      compiledTheme: compiledTheme,
      context: context,
      name: name,
      blog: blog,
      stylesheets: stylesheets,
      template: template,
      variant: variant,
      save: (): void => { },
      toObject: (): void => { },
    } as BlogPageModel;
    
    return model;
  }
}