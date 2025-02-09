import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSiteDto } from '.';

export class AdminCreateSiteDto extends CreateSiteDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public businessId: string;
}
