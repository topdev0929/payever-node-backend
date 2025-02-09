import { ProductInterface } from '../../products/interfaces';
import { TrainingDataDto } from '../dto';
import { CategoryInterface } from '../../categories/interfaces';

type NormalizeProduсtArgument = {
  description: string;
  category: Omit<CategoryInterface, 'ancestors'> & {
    ancestors: CategoryInterface[];
  };
  title: string;
};

export class DataNormalizerHelper {
  public static normalize(
    product: NormalizeProduсtArgument,
  ): TrainingDataDto {
    return {
      input: this.convertProductToInput(product),
      output: this.extractCategory(product),
    };
  }

  public static convertProductToInput(product: NormalizeProduсtArgument): string {
    return product.title;
  }

  private static extractCategory(product: NormalizeProduсtArgument): string {
    if (product.category) {
      const fullPath: Array<{ name: string }> = [...product.category.ancestors, product.category];

      return fullPath.map(
        (category: CategoryInterface) => category.name,
      ).join('/');
    }

    return '';
  }
}
