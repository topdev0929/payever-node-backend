import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class CompanyCreditLineGeneralRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  public external_id: string;
}
