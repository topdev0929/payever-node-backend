import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SendToDeviceRequestDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  public email: string;

  @ApiProperty()
  @IsOptional()
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
  public message: string;
}
