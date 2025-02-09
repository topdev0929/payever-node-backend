import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AppointmentFilterDto {
  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public businessId?: string;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  public parentFolder?: string;
}
