import { InputType, Field } from 'type-graphql';
import { SizeInterface } from '@pe/builder-sdk';

@InputType()
export class SizeInput implements Partial<SizeInterface> {

  @Field()
  public width: number;

  @Field()
  public height: number;
}
