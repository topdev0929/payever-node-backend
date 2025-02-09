import { Field, ObjectType } from 'type-graphql';
import { CategoryClass } from './category.class';

@ObjectType()
export class CategoryCreateClass implements Partial<CategoryClass> {
  @Field({ nullable: true })
  public description?: string;

  @Field()
  public name: string;
}
