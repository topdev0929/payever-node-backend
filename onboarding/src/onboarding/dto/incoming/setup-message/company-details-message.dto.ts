import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import {
  Transform,
} from 'class-transformer';

const BRANCHE_OTHER: string = 'BRANCHE_OTHER';

/**
 * @see users/src/user/dto/create-business/company-details.dto.ts
 */
export class CompanyDetailsMessageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public industry?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform((value: string) => value === '' ? BRANCHE_OTHER : value)
  public product: string =  BRANCHE_OTHER;
}
