import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessReportRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  public businessIds: string[];
}
