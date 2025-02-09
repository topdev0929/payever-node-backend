import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CompanyDocumentsInterface } from '../../interfaces';

export class CompanyDocumentsDto implements CompanyDocumentsInterface {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public commercialRegisterExcerptFilename?: string;
}
