import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ReportDataRequestedDto {
  @ApiProperty()
  @IsNotEmpty()
  public businessIds: string[];
}
