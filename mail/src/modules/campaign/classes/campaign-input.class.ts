import { Field, InputType } from 'type-graphql';
import { Campaign } from './campaign.class';
import { CampaignStatus } from '../enums';
import { ScheduleInputClass } from './schedule-input.class';

@InputType()
export class CreateCampaignInput implements Partial<Campaign> {

  @Field()
  public name: string;

  @Field({ nullable: true })
  public themeId?: string;

  @Field({ nullable: true })
  public preview?: string;

  @Field(() => [String], { nullable: true })
  public categories?: string[];

  @Field(() => [String], { nullable: true })
  public contacts?: string[];

  @Field({ nullable: true })
  public date: Date;

  @Field({ nullable: true })
  public from?: string;

  @Field()
  public status: CampaignStatus;

  @Field(() => [String], { nullable: true })
  public schedules?: ScheduleInputClass[];

  @Field({ nullable: true })
  public template?: string;

  @Field(() => [String], { nullable: true })
  public productIds?: string[];
}
