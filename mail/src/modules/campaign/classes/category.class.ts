import { Field, ObjectType } from 'type-graphql';
import { CategoryInterface } from '../interfaces';

@ObjectType()
export class CategoryClass implements CategoryInterface {
  @Field()
  public id: string;

  @Field()
  public business: string;

  @Field({ nullable: true })
  public description?: string;

  @Field()
  public name: string;
}
