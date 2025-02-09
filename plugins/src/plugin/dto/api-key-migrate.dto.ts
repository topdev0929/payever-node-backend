import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApiKeyMigrateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public business_uuid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public client: string;
}
