import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckoutSectionsSetupMessageDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public preset?: string;
}
