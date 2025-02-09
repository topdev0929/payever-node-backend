import { IsBoolean, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentNetworkDto } from '.';

export class AdminAppointmentNetworkDto extends AppointmentNetworkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}
