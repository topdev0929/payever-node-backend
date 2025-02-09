import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class OrderAddressIncomingDto {
  @ApiProperty()
  @IsString()
  @Expose()
  public city: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public country: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public first_name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public last_name: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public salutation?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public street: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public street_number?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public street_name?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public house_extension?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public zip: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public street_line_2?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public region?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public organization_name?: string;
}
