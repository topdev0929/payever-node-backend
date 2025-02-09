import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';


export class LoginAsUserRequestDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  public id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform((email: string) => email.toLowerCase())  
  public email?: string;
}
