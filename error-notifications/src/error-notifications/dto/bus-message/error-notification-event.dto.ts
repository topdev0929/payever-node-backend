import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ErrorNotificationInterface } from '../../interfaces';
import { ErrorNotificationTypesEnum } from '../../enums';

@Exclude()
export class ErrorNotificationEventDto implements ErrorNotificationInterface {
  @ApiProperty()
  @IsString()
  @Expose()
  public businessId: string;

  @ApiProperty()
  @IsEnum(ErrorNotificationTypesEnum)
  @Expose()
  public type: ErrorNotificationTypesEnum;

  @ApiProperty()
  @Expose()
  public errorDetails: any;

  @ApiProperty()
  @Expose()
  public errorDate: Date;

  @ApiProperty()
  @Expose()
  @IsOptional()
  public lastTimeSent?: Date;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsBoolean()
  public emailSent?: boolean;

  @ApiProperty()
  @Expose()
  @IsOptional()
  public integration?: string;
}
