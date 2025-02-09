import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateAccessConfigDto } from '../update-access-config.dto';

export class AdminUpdateAccessConfigCreateDto extends UpdateAccessConfigDto {
  @IsString()
  @IsNotEmpty()  
  public businessId?: string;  
}
