import { Field, ObjectType } from 'type-graphql';
import { Pagination } from './pagination.class';

@ObjectType()
export class Info {

  @Field((type: void) => Pagination, { nullable: true })
  public pagination?: Pagination;
}
