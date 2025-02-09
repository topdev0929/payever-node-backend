import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ClientSecretResponseDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public secret?: string;
}
