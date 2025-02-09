import { CreateBlogDto, BlogModel, UpdateBlogDto } from '../../../src/blog';
import { businessFixture } from './businessFixture';

export class blogFixture {
  public static getUpdateDTO(): UpdateBlogDto {
    return {
      active: true,
      title: 'updatedTestTitle',
    } as UpdateBlogDto;
  }
  public static getCreateDTO(): CreateBlogDto {
    return {
      name: 'testTitle',
    } as CreateBlogDto;
  }
  public static getModelWithoutCollectionsAndStubs(id: string): BlogModel {
    return {
      _id: id,
      title: 'testTitle',
      save: (): void => { },
    } as any;
  }
  public static getModel(id: string, category: string = null, title: string = 'testTitle'): BlogModel {
    const model: BlogModel = {
      _id: id,
      id: id,
      title: title,
      name: title,
      save: (): void => { },
      findOneAndDelete: (): void => { },
      toObject: (): void => { },
    } as any;
    businessFixture.addStubs(model);
    return model;
  }
}
