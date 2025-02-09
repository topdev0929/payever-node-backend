import { defaultMediaThemeCategoryFixtures } from './default-media-theme-category.fixtures';

const BRANCHE_OTHERS: string = 'BRANCHE_OTHERS';

export class ThemeCategoryIndustry {
  public static transform(themeCategory: string): string {
    
    for (const themeCategoryIndustry of defaultMediaThemeCategoryFixtures) {
      if (themeCategoryIndustry.themeCategory.toLowerCase() === themeCategory.toLowerCase()) {
        return themeCategoryIndustry.industry;
      }
    }

    return BRANCHE_OTHERS;
  }
}
