import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsOptional()
  public createdAt: string;
}
