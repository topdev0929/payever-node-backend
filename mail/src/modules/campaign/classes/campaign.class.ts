import { Field, ObjectType } from 'type-graphql';

import { AttachmentInterface, CampaignInterface } from '../interfaces';

@ObjectType()
export class Campaign implements CampaignInterface {

  @Field()
  public id: string;

  @Field()
  public business: string;

  @Field(() => [String], { nullable: true })
  public categories?: string[];

  @Field()
  public channelSet: string;

  @Field({ nullable: true })
  public theme?: string;

  @Field()
  public name: string;

  @Field({ nullable: true })
  public preview?: string;

  @Field(() => [String], { nullable: true })
  public contacts?: string[];

  @Field({ nullable: true })
  public date: Date;

  @Field({ nullable: true })
  public status: string;

  @Field(() => [String], { nullable: true })
  public attachments?: AttachmentInterface[];

  @Field({ nullable: true })
  public template?: string;

  @Field(() => [String], { nullable: true })
  public productIds?: string[];
}
