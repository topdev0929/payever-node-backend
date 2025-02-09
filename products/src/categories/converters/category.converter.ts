import { CategoryModel } from '../models';
import { CategoryAttributeDto, CategoryDto, ParentCategoryDto } from '../dto';

export class CategoryConverter {
  public static toCategoryWithInheritedAttributes(category: CategoryModel): CategoryDto {
    if (!category) {
      return null;
    }

    return {
      ancestors: category.ancestors ? category.ancestors.map(cat => CategoryConverter.toParentCategory(cat)) : [],
      attributes: category.attributes,
      business: { id: category.businessId },
      description: category.description,
      id: category.id,
      image: category.image,
      inheritedAttributes: this.getInheritedAttributes(category.ancestors),
      name: category.name,
      parent : this.toParentCategory(category.parent as CategoryModel),
      slug: category.slug,
    };
  }

  public static toParentCategory(category: CategoryModel): ParentCategoryDto {
    if (!category) {
      return null;
    }

    return {
      business: {
        id: category.businessId,
      },
      description: category.description,
      id: category.id,
      image: category.image,
      name: category.name,
      slug: category.slug,
    };
  }

  private static getInheritedAttributes(ancestors: CategoryModel[]): CategoryAttributeDto[] {
    const attributes: CategoryAttributeDto[] = [];
    for (const parent of ancestors) {
      if (!parent.attributes) {
        continue;
      }

      for (const parentAttribute of parent.attributes) {
        attributes.push(parentAttribute);
      }
    }

    return attributes;
  }
}
