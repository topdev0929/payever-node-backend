import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { FieldTypesEnum } from '../../enums';

@InputType()
export class CreateFieldDtoFieldDto {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  public name: string;

  @IsEnum(FieldTypesEnum)
  @Field(() => String)
  public type: FieldTypesEnum;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean)
  public filterable?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean)
  public editableByAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean)
  public showDefault?: boolean;

  @IsString({ each: true })
  @IsOptional()
  @Field(() => [String], {
    nullable: true,
  })
  public defaultValues: string[];
}
