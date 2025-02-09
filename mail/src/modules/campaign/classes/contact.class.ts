import { Field, ObjectType } from 'type-graphql';
import { ContactInterface } from '../interfaces';

@ObjectType()
export class ContactClass implements ContactInterface {
  @Field()
  public id: string;

  @Field()
  public business: string;

  @Field(() => [String], { nullable: true })
  public contacts: string[];
}
