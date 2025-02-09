import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAppointmentDtoAppointmentFieldDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  public value: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  public fieldId: string;
}
