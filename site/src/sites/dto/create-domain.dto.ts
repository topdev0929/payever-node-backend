// tslint:disable: max-classes-per-file
import { IsNotEmpty, IsString, IsFQDN, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDomainDto {
  @ApiProperty()
  @IsFQDN()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public provider: string;
}
