import { IsNotEmpty, IsString, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeAccountDto } from './employee-account.dto';
import { UserTokenInterface } from '@pe/nest-kit';


export class EmployeeDto {

  @IsString()
  public businessId: string;

  @Type(() => EmployeeAccountDto)
  @ValidateNested()
  public employee: EmployeeAccountDto;

  @Type(() => EmployeeAccountDto)
  @ValidateNested()
  public dto: EmployeeAccountDto;

  @IsBoolean()
  @IsOptional()
  public confirmEmployee?: boolean;

  @IsOptional()
  public customAccess?: any;

}
