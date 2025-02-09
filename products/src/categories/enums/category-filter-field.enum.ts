import { FilterFieldMapping } from '../../common/helpers';

export enum CategoryFilterFieldEnum {
  Id = 'id',
  Name = 'name',
  Slug = 'slug',
}

export const CategoryFilterFieldsMapping: FilterFieldMapping<CategoryFilterFieldEnum> = {
  [CategoryFilterFieldEnum.Id]: '_id',
  [CategoryFilterFieldEnum.Name]: 'name',
  [CategoryFilterFieldEnum.Slug]: 'slug',
};
