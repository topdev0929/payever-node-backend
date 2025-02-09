import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Expose } from 'class-transformer';

@Expose()
export class CreateApplicationAccessRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  public applicationId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public type: string;
}
