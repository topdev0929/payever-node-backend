import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public currency: string;

  @ApiProperty()
  @IsOptional()
  public createdAt: string;
}
