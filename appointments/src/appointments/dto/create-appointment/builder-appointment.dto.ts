import { IsOptional, IsString, ValidateNested, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

import { InputType } from '@nestjs/graphql';
import { CreateContactRBMQDto } from './create-contact-rbmq.dto';
import { MeasuringEnum } from '../../enums';

@InputType()
export class BuilderAppointmentDto {
  @ValidateNested({ each: true })
  @Type(() => CreateContactRBMQDto)
  @IsOptional()
  public contact?: CreateContactRBMQDto;

  @IsString()
  @IsOptional()
  public date?: string;

  @IsString()
  @IsOptional()
  public time?: string;

  @IsOptional()
  public fields: any;

  @IsString()
  @IsOptional()
  public appointmentNetwork: string;

  @IsNumber()
  @IsOptional()
  public duration?: number;

  @IsEnum(MeasuringEnum)
  @IsOptional()
  public measuring?: MeasuringEnum;
}
