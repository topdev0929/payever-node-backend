import { IsString } from 'class-validator';

export class ProductCategoryDto {
  @IsString()
  public title: string;

  constructor(title: string) {
    this.title = title;
  }
}
