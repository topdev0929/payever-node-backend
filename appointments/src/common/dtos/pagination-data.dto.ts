import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PagingDataDto {
  @Field(() => Number)
  public page: number;

  @Field(() => Number)
  public total: number;
}
