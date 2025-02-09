import { IsString, IsOptional } from 'class-validator';
import { BusinessBaseDto } from './business-base.dto';

export class BusinessHttpRequestDto extends BusinessBaseDto {
  @IsString()
  @IsOptional()
  public name: string;

}
