import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthOnboardingDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public last_name: string;
}
