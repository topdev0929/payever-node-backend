import { IsDefined, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from './business-reference.dto';

export class BusinessMediaDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;

  @IsString()
  @IsNotEmpty()
  public mediaType: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public url: string;
}
