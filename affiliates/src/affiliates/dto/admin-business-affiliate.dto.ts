import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AffiliateDto } from '.';
import { Type } from 'class-transformer';

export class AdminBusinessAffiliateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  
  @ApiProperty()
  @ValidateNested()
  @Type(() => AffiliateDto)
  @IsNotEmpty()
  public affiliate: AffiliateDto;
}
