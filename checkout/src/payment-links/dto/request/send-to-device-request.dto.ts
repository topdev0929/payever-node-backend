import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SendToDeviceRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public subject: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsPhoneNumber(null)
  public phoneFrom: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsPhoneNumber(null)
  public phoneTo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public message: string;
}
