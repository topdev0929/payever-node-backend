import { ObjectType, Field } from 'type-graphql';

import { Campaign } from './campaign.class';
import { Info } from './info.class';

@ObjectType()
export class Campaigns {

  @Field((type: void) => [Campaign], { nullable: true })
  public campaigns?: Campaign[];

  @Field((type: void) => Info, { nullable: true })
  public info?: Info;
}
