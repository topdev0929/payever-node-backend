import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditIntegrationDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID('4', { each: true })
  public allowedBusinesses: string[];
}
