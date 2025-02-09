import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { CreateAppointmentDto } from '.';

@InputType()
export class AdminAppointmentDto extends CreateAppointmentDto {  
  @IsString()  
  @IsNotEmpty()  
  public businessId?: string;

  @IsString()  
  @IsOptional()
  public targetFolderId?: string;
}
