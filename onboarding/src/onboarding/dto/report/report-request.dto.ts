import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class ReportRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public bulkImportId: string;
}
