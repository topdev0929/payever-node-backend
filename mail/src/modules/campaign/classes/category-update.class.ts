import { Field, ObjectType } from 'type-graphql';
import { CategoryClass } from './category.class';

@ObjectType()
export class CategoryUpdateClass implements Partial<CategoryClass> {
  @Field({ nullable: true })
  public description?: string;

  @Field({ nullable: true })
  public name?: string;
}
