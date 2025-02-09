import { IsDefined, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from './business-reference.dto';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public type: string;
}
