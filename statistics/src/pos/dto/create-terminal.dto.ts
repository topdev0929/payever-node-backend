import { IsDefined, IsNotEmpty, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessReferenceDto } from './business-reference.dto';

export class CreateTerminalDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => BusinessReferenceDto)
  public business: BusinessReferenceDto;
  
  @IsString()
  @IsNotEmpty()
  public active: boolean;

  @IsString()
  @IsOptional()
  public domain: string;
}
