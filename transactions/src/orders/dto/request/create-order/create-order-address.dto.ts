import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class CreateOrderAddressDto {
  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public salutation: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public first_name: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public last_name: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public street: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public street_number: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public zip: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  @ValidateIf((o: CreateOrderAddressDto) => o.country !== '', { groups: ['create']})
  @Length(2, 2, { groups: ['create']})
  public country: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public region: string;

  @ApiProperty()
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public city: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public organization_name?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public street_line_2?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public street_name?: string;

  @ApiProperty({ required: false})
  @IsString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  public house_extension?: string;
}
