import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Field as GQLField, InputType } from '@nestjs/graphql';

import { FieldTypesEnum } from '../../enums';

@InputType()
export class UpdateFieldDtoFieldDto {
  @GQLField(() => String, {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public title?: string;

  @GQLField(() => String, {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public name?: string;

  @GQLField(() => String, {
    nullable: true,
  })
  @IsOptional()
  @IsEnum(FieldTypesEnum)
  public type?: FieldTypesEnum;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  public filterable?: boolean;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  public editableByAdmin?: boolean;

  @GQLField(() => Boolean, {
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  public showDefault?: boolean;

  @GQLField(() => [String], {
    nullable: true,
  })
  @IsOptional()
  @IsString({ each: true })
  public defaultValues?: string[];

  @GQLField(() => String, {
    nullable: true,
  })
  @IsString()
  @IsOptional()
  public appointmentId?: string;
}
