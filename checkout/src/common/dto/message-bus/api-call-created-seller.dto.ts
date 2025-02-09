import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ApiCallCreatedSellerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  public id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose({ name: 'first_name' })
  public firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose({ name: 'last_name' })
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  public email?: string;
}
