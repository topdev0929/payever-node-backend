import { Field, ObjectType } from 'type-graphql';
import { CategoryClass } from './category.class';
import { Info } from './info.class';

@ObjectType()
export class CategoriesClass {

  @Field(() => [CategoryClass], { nullable: true })
  public categories?: CategoryClass[];

  @Field(() => Info, { nullable: true })
  public info?: Info;
}
