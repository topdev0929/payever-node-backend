import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class GetClientActionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  public businessId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Expose()
  public integration: string;

  @IsOptional()
  @IsString()
  @Expose()
  @ApiProperty({ required: false})
  public connectionId?: string;
}
