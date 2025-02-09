import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PushNotificationDto {

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public message: string;

}
