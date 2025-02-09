import { IsNotEmpty, IsString } from 'class-validator';
import { Field, ObjectType, InputType } from '@nestjs/graphql';

@InputType()
@ObjectType()
export class AppointmentFieldDto {
  @IsString()
  @IsNotEmpty()
  @Field()
  public value: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  public fieldId: string;
}
