import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, ValidateIf } from 'class-validator';

export class CreatePaymentAddressDto {
  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public salutation: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public first_name: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public last_name: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public street: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  @ValidateIf((o: CreatePaymentAddressDto) => !!o.street_number, { groups: ['create', 'submit']})
  @Length(0, 10, { groups: ['create', 'submit']})
  public street_number: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public zip: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  @ValidateIf((o: CreatePaymentAddressDto) => o.country !== '', { groups: ['create']})
  @Length(2, 2, { groups: ['create', 'submit']})
  public country: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public region: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create']})
  @IsNotEmpty({ groups: ['submit']})
  public city: string;

  @ApiProperty()
  @IsString({ groups: ['create', 'submit']})
  @IsOptional({ groups: ['create', 'submit']})
  public address_line_2: string;
}
