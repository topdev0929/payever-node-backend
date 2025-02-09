import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationInterface } from '../interfaces/notification.interface';

export class CancelNotificationDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public entity: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public kind: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public app?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;

  @ApiProperty()
  @IsOptional()
  public data?: { };
}
