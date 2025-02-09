import { Exclude, Expose, Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CompanyCreditLineGeneralRequestDto } from './company-credit-line-general-request.dto';

@Exclude()
export class CompanyCreditLineRequestDto {
  @Expose()
  @IsDefined()
  @ValidateNested()
  @Type(() => CompanyCreditLineGeneralRequestDto)
  public company: CompanyCreditLineGeneralRequestDto;
}
