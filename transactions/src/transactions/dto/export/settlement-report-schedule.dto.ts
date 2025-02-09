import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ExportFormatEnum, ReportDurationEnum } from '../../enum';
import { Transform } from 'class-transformer';
import { ScheduleInterface } from 'src/transactions/interfaces';

export class SettlementReportScheduleDto implements ScheduleInterface {
  @ApiProperty()
  @IsNotEmpty({
    message: 'forms.error.validator.required',
  })
  @IsString({
    message: 'forms.error.validator.email.invalid',
  })
  @IsEmail(undefined, {
    message: 'forms.error.validator.email.invalid',
  })
  @Transform((email: string) => email.toLowerCase())
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ReportDurationEnum)
  public duration: string;

  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  public paymentMethod: string;

  @ApiProperty()
  @IsOptional()
  public enabled: boolean = true;

  @ApiProperty()
  @IsOptional()
  public format: ExportFormatEnum = ExportFormatEnum.xlsx;
}
