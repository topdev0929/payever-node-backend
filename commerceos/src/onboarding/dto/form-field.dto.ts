import { IsDefined, IsString, IsBoolean, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FormFieldInterface, FormFieldValueInterface } from '../interfaces';
import { FormFieldTypeEnum } from '../enums';

export class FormFieldDto implements FormFieldInterface {
  @ApiProperty({ required: false })
  public _id?: string;

  @ApiProperty({ required: true })
  @IsString()
  public icon?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  public name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public relativeField?: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  public placeholder: string;

  @ApiProperty({ required: true })
  @IsBoolean()
  @IsDefined()
  public required: boolean;

  @ApiProperty({ required: true })
  @IsString()
  @IsDefined()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public type: FormFieldTypeEnum;

  @ApiProperty({ required: false })
  @IsArray()
  @IsOptional()
  public values?: FormFieldValueInterface[];

}
