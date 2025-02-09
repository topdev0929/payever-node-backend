import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsFQDN } from 'class-validator';

export class UpdateDomainDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsFQDN()
  @IsNotEmpty()
  public name: string;
}
