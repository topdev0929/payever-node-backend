import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Pagination {

  @Field({ nullable: true })
  public page?: number;

  @Field({ nullable: true })
  public page_count?: number;

  @Field({ nullable: true })
  public per_page?: number;

  @Field({ nullable: true })
  public item_count?: number;
}
