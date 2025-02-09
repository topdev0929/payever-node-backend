import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateContactRBMQDto {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public email: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public firstName: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public lastName: string;

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  public mobilePhone: string;
}
