import { BlogAccessConfigModel, BlogModel } from '../../../src/blog/models';
import { UpdateAccessConfigDto } from '../../../src/blog/dto';

export class blogAccessConfigFixture {
  
  public static getUpdateAccessConfigDTO(): UpdateAccessConfigDto {
    return {
      isLive: true,
      isLocked: false,
      internalDomain: '',
      internalDomainPattern: '',
    } as UpdateAccessConfigDto;
  }
  public static getModel(id: string, blog: BlogModel): BlogAccessConfigModel {
    const model: BlogAccessConfigModel = {
      _id: id,
      id: id,
      isLive: true,
      isLocked: false,
      internalDomain: '',
      internalDomainPattern: '',
      blog: blog,
      save: (): void => { },
      toObject: (): void => { },
    } as BlogAccessConfigModel;
    
    return model;
  }
}
