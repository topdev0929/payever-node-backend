import { IsBoolean, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class AppointmentEventDto {

  @IsString()
  @IsOptional()
  public _id: string;

  @IsString()
  @IsOptional()
  public businessId?: string;

  @IsBoolean()
  @IsNotEmpty()
  public allDay: boolean;

  @IsBoolean()
  @IsNotEmpty()
  public repeat: boolean;

  @IsString()
  @IsOptional()
  public date?: string;

  @IsString()
  @IsOptional()
  public time?: string;

  @IsString()
  @IsOptional()
  public location?: string;

  @IsString()
  @IsOptional()
  public note?: string;
}

