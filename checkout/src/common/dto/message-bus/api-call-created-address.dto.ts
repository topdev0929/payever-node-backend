import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { SalutationEnum } from '../../enum';

@Exclude()
export class ApiCallCreatedAddressDto {
  @ApiProperty()
  @Expose()
  public salutation?: SalutationEnum;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'first_name' })
  public firstName?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'last_name' })
  public lastName?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public street?: string;

  @ApiProperty()
  @IsString()
  @Expose({ name: 'street_number' })
  public streetNumber?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public city?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public zip?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public country?: string;

  @ApiProperty()
  @IsString()
  @Expose()
  public region?: string;
}
