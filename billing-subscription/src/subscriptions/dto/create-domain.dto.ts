import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsFQDN } from 'class-validator';

export class CreateDomainDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsFQDN()
  @IsNotEmpty()
  public name: string;
}
